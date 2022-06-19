package astro;

import calc.calculation.AstroComputerV2;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

/**
 * Calculate exact date of Spring, Summer, Fall, and Winter.
 */
public class SpringSummerFallWinter {

    private final static SimpleDateFormat SDF_UTC = new SimpleDateFormat("EEE yyyy-MMM-dd HH:mm:ss 'UTC'");
    static {
        SDF_UTC.setTimeZone(TimeZone.getTimeZone("Etc/UTC"));
    }

    public static void main(String... args) {
        System.setProperty("deltaT", "AUTO");
        AstroComputerV2 astroComputerV2 = new AstroComputerV2();
//        System.setProperty("astro.verbose", "true");

        Calendar date = Calendar.getInstance(TimeZone.getTimeZone("Etc/UTC")); // Now
        int currentYear = date.get(Calendar.YEAR);
        System.out.printf("Year %d\n", currentYear);

        Calendar cal = new GregorianCalendar();
        cal.setTimeZone(TimeZone.getTimeZone("Etc/UTC" /*"America/Los_Angeles"*/));
        cal.set(Calendar.YEAR, currentYear);
        cal.set(Calendar.MONTH, 0);
        cal.set(Calendar.DAY_OF_MONTH, 1);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);

        System.out.println("Setting date to " + SDF_UTC.format(new Date(cal.getTime().getTime())) + ", let's go.");

        double prevDecl = -Double.MAX_VALUE;
        boolean goingUp = true; // Assuming it is not spring yet, and winter behind us.
        boolean crossed = false;
        long iterations = 0L;
        long before = System.currentTimeMillis();
        while (cal.get(Calendar.YEAR) == currentYear) {
            iterations++;
            astroComputerV2.calculate(
                    cal.get(Calendar.YEAR),
                    cal.get(Calendar.MONTH) + 1,
                    cal.get(Calendar.DAY_OF_MONTH),
                    cal.get(Calendar.HOUR_OF_DAY), // and not just HOUR !!!!
                    cal.get(Calendar.MINUTE),
                    cal.get(Calendar.SECOND));

            double sunDecl = astroComputerV2.getSunDecl();
            if (goingUp && sunDecl > 0 && !crossed) {
                System.out.println("Northern Spring/Southern Fall:\t\t" + SDF_UTC.format(new Date(cal.getTime().getTime())));
                crossed = true;
            }
            if (!goingUp && sunDecl < 0 && !crossed) {
                System.out.println("Northern Fall/Southern Spring:\t\t" + SDF_UTC.format(new Date(cal.getTime().getTime())));
                crossed = true;
            }
            if (goingUp && sunDecl < prevDecl) {
                goingUp = false;
                crossed = false;
                // Northern Summer
                System.out.println("Northern Summer/Southern Winter:\t" + SDF_UTC.format(new Date(cal.getTime().getTime())));
            }
            if (!goingUp && sunDecl > prevDecl) {
                goingUp = true;
                crossed = false;
                // Southern Summer
                System.out.println("Northern Winter/Southern Summer:\t" + SDF_UTC.format(new Date(cal.getTime().getTime())));
            }
//            if (iterations % (3_600 * 24) == 0) {
//                System.out.println("\tDate is now " + SDF_UTC.format(new Date(cal.getTime().getTime())));
//            }
            prevDecl = sunDecl;
//            cal.add(Calendar.SECOND, 1); // TODO Use dichotomy (Newton)
            cal.add(Calendar.MINUTE, 10); // 10);
//            cal.add(Calendar.HOUR_OF_DAY, 1);
        }
        long after = System.currentTimeMillis();
        System.out.printf("Used %s iterations, in %s ms.\n",
                NumberFormat.getInstance().format(iterations),
                NumberFormat.getInstance().format(after - before));
    }
}
