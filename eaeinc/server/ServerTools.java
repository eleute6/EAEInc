/* TOOLS FOR SERVERSIDE *
 * A comprehensive set of tools for readability and
 * managing server side processes. All processes are
 * commented to help give guidance to readers. 
 */

 // IMPORTS //

 // CRYPTO //
import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;

// CSV //
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import com.opencsv.CSVReader;
import java.io.File;
import java.io.FileReader;

// SQL //
import java.sql.*;
import java.time.*;

public class ServerTools {
    // CRYPTOGRAPHY TOOLS
    private static final int AES_KEY_SIZE = 128; //Bit Size
    private static final int IV_SIZE = 12; //Bytes Size
    private static final int TAG_LENGTH = 128; //Bit Size
    /* Function: KEYGEN
     * A tool for generating AES Keys to use for Encryption & Decryption
     */
    public static SecretKey keyGenAES() throws NoSuchAlgorithmException {
        //STEP 1: Initialize Key Generator
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(AES_KEY_SIZE);

        //STEP 2: Generate Key
        return keyGen.generateKey();
    }

    /* Function: ENCRYPTION
     * Encrypts plaintext with AES-GCM encryption with provided secret key and IV.
     */
    public static byte[] encryptAES(byte[] plain, SecretKey key, byte[] iv) throws Exception {
        //STEP 1: Create a Valid Cipher
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");

        //STEP 2: Generate Specifications for Encryption
        GCMParameterSpec gSpec = new GCMParameterSpec(TAG_LENGTH, iv);
        c.init(Cipher.ENCRYPT_MODE, key, gSpec);

        //STEP 3: Generate Encrypted Message
        return c.doFinal(plain);
    }

    /* Function: DECRYPTION
     * Decrypts plaintext with AES-GCM encryption with provided secret key and IV.
     */
    public static byte[] decryptAES(byte[] cipher, SecretKey key, byte[] iv) throws Exception {
        //STEP 1: Create a Valid Cipher
        Cipher c =Cipher.getInstance("AES/GCM/NoPadding");

        //STEP 2: Generate Specifications for Decryption
        GCMParameterSpec gSpec = new GCMParameterSpec(TAG_LENGTH, iv);
        c.init(Cipher.DECRYPT_MODE, key, gSpec);

        //STEP 3: Generate Decryption
        return c.doFinal(cipher);
    }

    /* Function: GENERATEIV
     * Generates IV for encrypting data using AES standards.
     */
    public static byte[] generateIV() {
        //STEP 1: Generate IV Tools
        byte[] iv = new byte[IV_SIZE];
        SecureRandom random = new SecureRandom();

        //STEP 2: Generate IV
        random.nextBytes(iv);
        return iv;
    }

    /**
     * Function: ENCODEKEY
     * Encodes a SecretKey to Base64 for storage and sending.
     */
    public static String encodeKey(SecretKey key){
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    /**
     * Function: DECODEKEY
     * Decodes a SecretKey from Base64 back to a key for usage.
     */
    public static SecretKey decodeSecretKey(String base64Key){
        byte[] decoded = Base64.getDecoder().decode(base64Key);
        return new SecretKeySpec(decoded, 0, decoded.length, "AES");
    }

    // CSV TOOLS //
    /* Function: READCSV
     * A tool for reading CSV files into a usable format for sorting. 
     */

    public static List<List<String>> readCSV(File f) throws Exception {
        //STEP 1: Initialize List for Data Filling
        List<List<String>> compiledData = new ArrayList<List<String>>();

        //STEP 2: Establish Reader for CSV File
        try (CSVReader cRead = new CSVReader(new FileReader(f));) {
            //STEP 3: Attempt to Read CSV File
            String[] values = null;
            while ((values = cRead.readNext()) != null) { //Reads in data from CSV file into array...
                //... then appends to the List
                compiledData.add(Arrays.asList(values));
            }
        }
        return compiledData;
    }

    // SQL TOOLS //
    /* Function: RETRIEVETABLE
     * Given a connection to the database, retrieves
     * the *entire* table. Not recommended for usage
     * other than testing.
    */

    public static ResultSet retrieveTable(Connection con, String table) throws Exception {
        //STEP 1: Initialize Variables
        String sql = "SELECT * FROM " + table; //SQL Command
        PreparedStatement p = con.prepareStatement(sql); //Statement 
        ResultSet rs = null; //Resulting Data
        
        //STEP 2: Try to Recover Table
        try {
            rs = p.executeQuery();
        }
        catch (SQLException e) {
            System.out.println(e);
        }

        //STEP 3: Return Table
        return rs;
    }

    /* Function: RETRIEVEINITPOSTS
     * Given a connection to the database, specifically retrieves
     * a set of posts to be displayed for initialization.
     */
    public static List<List<Object>> retrieveInitPosts(Connection con) throws Exception {
        //STEP 1: Prepare Request and Initialize Objects
        List<List<Object>> dataSet = new ArrayList<List<Object>>();
        String sql = "SELECT TOP 10 * FROM Forum WHERE isDeleted = FALSE";
        PreparedStatement p = con.prepareStatement(sql);
        ResultSet rs = null;

        //STEP 2: Try to Recover Rows
        try {
            rs = p.executeQuery();
            while (rs.next()) {
                //STEP 3: Recover Items from Row
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String body = rs.getString("body");
                String emailID = rs.getString("emailID");
                LocalDateTime timestamp = rs.getTimestamp("timestamp").toLocalDateTime();
                String tags = rs.getString("searchtag");

                //STEP 4: Create the List to Add
                List<Object> bucket = List.of(id, title, body, emailID, timestamp, tags);
                dataSet.add(bucket);
            }
        }
        catch (SQLException e) {
            System.out.println(e);
        }

        return dataSet;
    }
}