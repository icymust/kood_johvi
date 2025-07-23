package itinerary;

import java.io.IOException; //нужна для обработки ошибок, которые могут возникнуть при работе с файлами
import java.nio.file.Files; //позволяют легко читать и записывать файлы
import java.nio.file.Paths; //позволяют легко читать и записывать файлы
import java.nio.file.StandardOpenOption; //указывает, как именно открывать файл для записи
import java.util.HashMap; //коллекции для хранения данных, как словари и списки
import java.util.List; //коллекции для хранения данных, как словари и списки
import java.util.ArrayList; //коллекции для хранения данных, как словари и списки
import java.util.Map; //коллекции для хранения данных, как словари и списки
import java.io.File; //для работы с файлами на компьютере
import java.time.ZonedDateTime; //для работы с датами и временем
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Prettifier {

   //это словарь, который будет хранить коды аэропортов и их названия
   private static Map<String, String> airportLookup = new HashMap<>();

   public static void main(String[] args) {
      // Проверка, есть ли в аргументах -h
      if (args.length < 3 || args[0].equals("-h")) {
          printHelp(); // Выводим помощь, если аргументов недостаточно или есть "-h"
          return; // Завершаем выполнение программы после вывода справки
      }

      String inputPath = args[0];
      String outputPath = args[1];
      String airportLookupPath = args[2];

      // Проверяем существование входного файла и файл справочника аэропортов
      if (!fileChecker(inputPath, ".txt", "Input not found") ||
         !fileChecker(airportLookupPath, ".csv", "Airport lookup not found")) {
         return;
      }

      // Проверяем, что выходной файл имеет формат ".txt"
      if (!outputPath.toLowerCase().endsWith(".txt")) {
         System.out.println("Output file format is Incorrect");
         return;
      }

      try {
         // Загружаем справочник аэропортов
         loadAirportLookup(airportLookupPath);

         // Чтение и обработка файла маршрута
         //читает строки из файла input.txt
         List<String> itineraryLines = Files.readAllLines(Paths.get(inputPath));

         //обрабатывает строки заменяет коды аэропортов, даты, убирает лишние пустые строки
         List<String> processedLines = processItinerary(itineraryLines);

         //записывает обработанного маршрута в output.txt
         Files.write(Paths.get(outputPath), processedLines, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
         System.out.println("The file was successfully written to " + outputPath);
      } catch (IOException e) {
         System.out.println("Error while processing files: " + e.getMessage());
     }

   }

   //вывода помощи запуска программы
   private static void printHelp() {
      System.out.println("\nitinerary usage:");
      System.out.println("$ java Prettifier.java ./input.txt ./output.txt ./airport-lookup.csv\n");
   }

   //проверяет существует ли файл, правильный ли формат и возвращает ошибку
   public static boolean fileChecker(String fileName, String format, String error) {
      File file = new File(fileName);
      if (!file.exists() || !fileName.endsWith(format)) { 
         System.out.println(error);
         return false;
      }
      return true;  
   }

   //записывает в словарь все коды и названия 
   private static void loadAirportLookup(String path) throws IOException {
      //открывает файл lookup.csv, читает его построчно
      List<String> lines = Files.readAllLines(Paths.get(path));

      // Проверка заголовков
      String[] expectedHeaders = {"name", "city", "country", "icao_code", "iata_code","coordinates"};
      String[] actualHeaders = lines.get(0).split(",");

      if (actualHeaders.length < expectedHeaders.length) {
         throw new IOException("Airport lookup malformed");
      }

      if (lines.size() < 2) { // Проверяем, есть ли хотя бы одна строка с данными (помимо заголовка)
         throw new IllegalStateException("Airport lookup malformed");
      }

      //Из каждой строки берёт коды
      for (int i = 1; i < lines.size(); i++) {
         String[] columns = lines.get(i).split(",");

         // Проверяем наличие всех необходимых столбцов
         if (columns.length < 5) {
            throw new IllegalStateException("Airport lookup malformed");
         }

         String iataCode = columns[4].trim();
         String icaoCode = columns[3].trim();
         String airportName = columns[0].trim();

         // Проверяем, что поля не пустые
         if (airportName.isEmpty() || (icaoCode.isEmpty() && iataCode.isEmpty())) {
            System.out.println("Airport lookup malformed");
            System.exit(1); // Завершаем программу
         }
         
         //если такого нет , то записывает и добавляет решотки  
         if (!iataCode.isEmpty()) airportLookup.put("#" + iataCode, airportName);
         if (!icaoCode.isEmpty()) airportLookup.put("##" + icaoCode, airportName);
      }
   }

   //обработка маршрута
   private static List<String> processItinerary(List<String> lines) {
      List<String> processedLines = new ArrayList<>();
      boolean lastLineWasEmpty = false;

      for (String line : lines) {
         
         // Удаляем лишние пробелы
         line = line.trim().replaceAll("\\s{2,}", " ");

         // Преобразуем \v, \f, \r в реальные символы
         line = line.replace("\\v", "\n"); //символ вертикальной табуляции
         line = line.replace("\\f", "\n"); //символ перевода страницы
         line = line.replace("\\r", "\n");    //символ возврата каретки

         line = line.trim().replaceAll("\\s{2,}", "\n");

         


         // Преобразуем коды аэропортовб
         for (String code : airportLookup.keySet()) {
            if (line.contains(code)) {
               //заменяет коды аэропортов на их названия
               line = line.replace(code, airportLookup.get(code));
            }
         }

         
         // Преобразуем даты и время
         line = processDatesAndTimes(line);

         // Убираем лишние пустые строки
         if (line.trim().isEmpty()) {
            if (!lastLineWasEmpty) {
               processedLines.add(line);
               lastLineWasEmpty = true;
            }
         } else {
            processedLines.add(line);
            lastLineWasEmpty = false;
         }
      }
      return processedLines;
   }

   //обработка время и дат в строках
   private static String processDatesAndTimes(String line) {
      Pattern datePattern = Pattern.compile("D\\(([^)]+)\\)");
      Pattern time12Pattern = Pattern.compile("T12\\(([^)]+)\\)");
      Pattern time24Pattern = Pattern.compile("T24\\(([^)]+)\\)");

      Matcher dateMatcher = datePattern.matcher(line);
      line = replaceDatePattern(line, dateMatcher, "dd-MMM-yyyy");

      Matcher time12Matcher = time12Pattern.matcher(line);
      line = replaceTimePattern(line, time12Matcher, "hh:mma");

      Matcher time24Matcher = time24Pattern.matcher(line);
      line = replaceTimePattern(line, time24Matcher, "HH:mm");

      return line;
   }

   private static String replaceDatePattern(String line, Matcher matcher, String dateFormat) {
      while (matcher.find()) { // Пока есть совпадения в строке
         String dateStr = matcher.group(1); // Захватываем содержимое в скобках, например: "2023-11-04T12:00+02:00"
         try {
            ZonedDateTime dateTime = ZonedDateTime.parse(dateStr); // Парсим строку как дату
            String formattedDate = dateTime.format(DateTimeFormatter.ofPattern(dateFormat)); //// Форматируем дату в "dd-MMM-yyyy"
            line = line.replace(matcher.group(0), formattedDate); // Заменяем оригинальную дату на отформатированную
         } catch (DateTimeParseException e) {
            // Если формат некорректный, оставляем как есть
         }
      }
      return line;
   }

   private static String replaceTimePattern(String line, Matcher matcher, String timeFormat) {
      // Пока есть совпадения в строке
      while (matcher.find()) {
         String dateStr = matcher.group(1); // Захватываем содержимое в скобках, например: "2023-11-04T12:00+02:00"
         try {
            ZonedDateTime dateTime = ZonedDateTime.parse(dateStr); // Парсим строку как дату
            String offset = dateTime.getOffset().toString(); // Получаем временную зону, например: "+02:00"
            if (offset.equals("Z")) { // Если это UTC, заменяем "Z" на "(+00:00)"
               offset = "(+00:00)";
            } else {
               offset = "(" + offset + ")";
            }
            // Форматируем время + добавляем зону
            String formattedTime = dateTime.format(DateTimeFormatter.ofPattern(timeFormat)) + " " + offset; 
            // Заменяем оригинальное время на отформатированное
            line = line.replace(matcher.group(0), formattedTime);
         } catch (DateTimeParseException e) {
            // Если формат некорректный, оставляем как есть
         }
      }
      return line; // Возвращаем строку с заменённым временем
   }
}

