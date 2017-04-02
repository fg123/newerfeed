import java.util.*;
import java.math.*;
public class PoliticalComparator {
	private Map<String,Object> listOfUrls;
	private Map<String, Object> keywordList;
	private Map<Integer, Object> uniqueStory;

	public PoliticalComparator(Map<String,Object> listOfUrls) {
		this.listOfUrls = listOfUrls;
		keywordList = new HashMap<String, Stack<String>>();
		uniqueStory = new HashMap<Integer, Stack<String>>();
		populate();

	}

	private void generateId() {

	}
	// helper method to fill up keywordList with <keyword, Queue<urls>>
	private void populate() {

		// iterate through hash table of urls
		for(String url : listOfUrls) {
			String tempKey = null;
			// extract each hash table from the original hash table
			Map<String, Integer> freq = listOfUrls.get(string);
			// create a stack of urls
			Stack<String> urls = new Stack<String>;
			// iterate through the extracted hash table
			for(String keyword : freq) {
				tempKey = keyword;
				// enqueue the url onto the above stack for each keywrod
				urls.enqueue(url);
			}
			// associate the keyword with the urls that contain it
			keywordList.put(tempKey, urls);

		}
	}
	// check whether a certain article has the same content as another
	// current article
	public boolean same() {
		for(String keyword : keywordList) {
			Map<String, Integer> freq = listOfUrls.get(string); 

		}


	}
}
