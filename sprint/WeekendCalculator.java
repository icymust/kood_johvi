package sprint;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.DayOfWeek;

public class WeekendCalculator {
   // solution code here
   public static Integer countWeekendDays(LocalDate startDate, LocalDate endDate ){
      int count = 0; //schet vqhodnqh
      int daysBetween = Math.toIntExact(ChronoUnit.DAYS.between(startDate, endDate)+1);
      for (int i = 0; i < daysBetween; i++) {
         DayOfWeek dayOfWeek = startDate.getDayOfWeek();
         if((dayOfWeek== DayOfWeek.SATURDAY|| dayOfWeek==DayOfWeek.SUNDAY)){
            count++;
         }
         // Добавляем один день к дате на каждой итерации
         startDate = startDate.plusDays(1);
         
      }
      return count;
   }

      
    
}