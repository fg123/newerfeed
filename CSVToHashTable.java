import java.util.*;
import java.io.*;

public class CSVToHashTable {
	private Map<String,Object> listOfUrls;

	public CSVToHashTable(File file) {

		String line = null;
		try {
			BufferedReader br = new BufferedReader(new FileReader(file));
			listOfUrls = new HashMap<String, Object>();
			// While line is not null, read in
			try {
				while((line = br.readLine()) != null) {
					parseLine(br.readLine());
				}

			}
			catch(IOException exception) {
				System.out.println("The line was null.");
			}
		}
		catch(FileNotFoundException exception) {
			System.out.println("The file was not found.");
		}

	}
	public void parseLine(String line) {

		// Split url entries by ";"
		String str[] = line.split(";");
		// Create new map
		Map<String, Integer> keyWords = new HashMap<String, Integer>();
		String url = null;
		// for the number of lines there are
		for(int i = 0; i < str.length; i++) {
			// split the url from the keywords
			String urlToKeyWord[] = str[i].split(":");
			// url is always the first entry in the list
			url = str[0];
			// split the keywords by ", "
			String arr[] = str[1].split(". ");
			// split the keywords and frequencies by ". "
			String tempFreq[] = urlToKeyWord[i].split(", ");
			int freq[] = new int[tempFreq.length];
			for(int a = 0; a < tempFreq.length; a++) {
				freq[a] = Integer.parseInt(tempFreq[a]);
			}
			for(int j = 0; j < arr.length; j++) {
				// put the keyword and associate it with the appropriate frequency
				keyWords.put(arr[j], freq[j]);
			}
		}
		listOfUrls.put(url, keyWords);
	}

	public Map<String,Object> map() {
		return listOfUrls;
	}

	public static void main(String[] args) {
		File file = new File(args[0]);
		CSVToHashTable hashed = new CSVToHashTable(file);
		// Unit Testing

	}
}
