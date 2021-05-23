package celestial.almanac;

import calc.calculation.AstroComputer;
import utils.TimeUtil;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.TimeZone;

/**
 * Another example.
 * Run the main.
 */
public class MoonIllumination {

    private final static SimpleDateFormat SDF_UTC = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss 'UTC'");
    static {
        SDF_UTC.setTimeZone(TimeZone.getTimeZone("Etc/UTC"));
    }

    public static void main(String... args) {

        boolean now = true;
        boolean csv = Arrays.stream(args).filter(arg -> "--csv".equals(arg)).findFirst().isPresent();

        Calendar date = Calendar.getInstance(TimeZone.getTimeZone("Etc/UTC")); // Now
        date.set(Calendar.MINUTE, 0);
        date.set(Calendar.SECOND, 0);

        if (!now) { // Hard coded date
            date.set(Calendar.YEAR, 2020);
            date.set(Calendar.MONTH, Calendar.MARCH);
            date.set(Calendar.DAY_OF_MONTH, 28);
            date.set(Calendar.HOUR_OF_DAY, 16); // and not just Calendar.HOUR !!!!
            date.set(Calendar.MINUTE, 50);
            date.set(Calendar.SECOND, 20);
        }
        // System.out.println(String.format("Calculations for %s (%s)", SDF_UTC.format(date.getTime()), now ? "now" : "not now"));

        // Recalculate
        double deltaT = TimeUtil.getDeltaT(date.get(Calendar.YEAR), date.get(Calendar.MONTH) + 1);
//		System.out.printf(">> deltaT: %f s\n", deltaT);
        AstroComputer.setDeltaT(deltaT);

        if (csv) {
            System.out.println("Date\tMoon Illumination (%)");
        }

        Calendar until = Calendar.getInstance(TimeZone.getTimeZone("Etc/UTC")); // End date.
        until.add(Calendar.YEAR, 1);
        while (date.before(until)) {
            // All calculations here
            AstroComputer.calculate(
                    date.get(Calendar.YEAR),
                    date.get(Calendar.MONTH) + 1, // Jan: 1, Dec: 12.
                    date.get(Calendar.DAY_OF_MONTH),
                    date.get(Calendar.HOUR_OF_DAY), // and not just Calendar.HOUR !!!!
                    date.get(Calendar.MINUTE),
                    date.get(Calendar.SECOND));
            double moonIllum = AstroComputer.getMoonIllum();
            if (csv) {
                System.out.println(String.format("%s\t%05.02f", SDF_UTC.format(date.getTime()), moonIllum));
            } else {
                System.out.println(String.format("%s - Moon Illumination: %05.02f%%", SDF_UTC.format(date.getTime()), moonIllum));
            }
            // Increment by 1 hour
            date.add(Calendar.HOUR_OF_DAY, 1);
        }
    }
}
