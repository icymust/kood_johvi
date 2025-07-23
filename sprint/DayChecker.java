package sprint;

import java.time.LocalDate;
import java.time.DayOfWeek;

public class DayChecker {
   // solution code here
   public static String checkDayType(LocalDate date){
      DayOfWeek dayOfWeek = date.getDayOfWeek();
      String result;

      switch (dayOfWeek){
         case SATURDAY:
         case SUNDAY:
            result = "Weekend";
            break;
         case WEDNESDAY:
            result = "Hump Day!";
            break;
         default :
            result = "Weekday";
            break;
      }
      return result;
   }

}