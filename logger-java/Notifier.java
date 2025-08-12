import java.security.MessageDigest;
import java.time.Instant;

public class Notifier {

    public static String sha256(String base) {
        try{
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if(hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch(Exception ex){
            throw new RuntimeException(ex);
        }
    }

    public static String mineBlock(int index, String timestamp, int amount, String prevHash, int difficulty) {
        int nonce = 0;
        String hash;
        String target = new String(new char[difficulty]).replace('\0', '0');
        do {
            String data = index + timestamp + amount + prevHash + nonce;
            hash = sha256(data);
            nonce++;
        } while(!hash.substring(0, difficulty).equals(target));
        return hash;
    }

    public static void main(String[] args) {
        int index = 1;
        String timestamp = Instant.now().toString();
        int amount = 500;
        String prevHash = "00abcdef1234";
        int difficulty = 2;

        String hash = mineBlock(index, timestamp, amount, prevHash, difficulty);
        System.out.println("NXT ⥉ Java Notifier: Block mined");
        System.out.println("Amount: " + amount);
        System.out.println("Hash: " + hash);
    }
}
