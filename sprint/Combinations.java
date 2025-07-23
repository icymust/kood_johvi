package sprint;

import java.util.ArrayList;
import java.util.List;

public class Combinations {

    // Метод, который возвращает все комбинации длины n
    public List<String> combN(int n) {
        // Список, куда будем сохранять комбинации
        List<String> result = new ArrayList<>();

        // Если n <= 0, возвращаем пустой список
        if (n <= 0) {
            return result;  // Возвращаем пустой список
        }

        // Запускаем цикл по первой цифре комбинации
        for (int i = 0; i <= 9; i++) {
            // Запускаем создание комбинаций с этой цифры
            addCombinations("" + i, i + 1, n - 1, result);
        }

        return result;  // Возвращаем список с комбинациями
    }

    // Метод для добавления комбинаций
    private void addCombinations(String current, int nextDigit, int remainingDigits, List<String> result) {
        // Если больше не нужно добавлять цифры, добавляем комбинацию в результат
        if (remainingDigits == 0) {
            result.add(current);  // Добавляем комбинацию в список
            return;  // Заканчиваем этот вызов
        }

        // Добавляем следующую цифру по порядку
        for (int i = nextDigit; i <= 9; i++) {
            // Продолжаем строить комбинацию
            addCombinations(current + i, i + 1, remainingDigits - 1, result);
        }
    }
}
