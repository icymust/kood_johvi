package sprint;

import java.util.List;

public class ListManipulator {

   public List<String> manipulateList(List<String> list) {
      // Обрабатываем случай с пустым списком: добавляем только "first"
      if (list == null || list.isEmpty()) {
          list.add("first");
          return list;
      }

      // Обрабатываем случай с одним элементом: заменяем его на "first"
      if (list.size() == 1) {
          list.set(0, "first");
          return list;
      }

      // Для списков с двумя и более элементами:
      // Удаляем последний элемент
      list.remove(list.size() - 1);

      // Меняем предпоследний элемент на строку с размером списка
      list.set(list.size() - 1, "The size of the list is " + list.size());

      // Добавляем строку "last" в конец списка
      list.add("last");

      // Первый элемент делаем "first"
      list.set(0, "first");

      // Возвращаем изменённый список
      return list;
   }
}