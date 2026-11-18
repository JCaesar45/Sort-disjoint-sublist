import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LeadCheck {
    private static final Pattern EMAIL_FIELD = Pattern.compile("\"email\":\"([^\"]+)\"");
    private static final Pattern VALID = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    public static void main(String[] args) throws IOException {
        Path file = Paths.get(args.length > 0 ? args[0] : "data/leads.ndjson");
        if (!Files.exists(file)) {
            System.out.println("No leads yet.");
            return;
        }
        List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
        Set<String> seen = new HashSet<>();
        int valid = 0, invalid = 0, duplicates = 0;
        for (String line : lines) {
            if (line.isBlank()) continue;
            Matcher m = EMAIL_FIELD.matcher(line);
            if (!m.find() || !VALID.matcher(m.group(1)).matches()) {
                invalid++;
                continue;
            }
            if (!seen.add(m.group(1))) duplicates++;
            else valid++;
        }
        System.out.println("Valid unique: " + valid);
        System.out.println("Duplicates:   " + duplicates);
        System.out.println("Invalid:      " + invalid);
    }
}
