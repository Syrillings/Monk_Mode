package app.vercel.monkmodeone;

import android.os.Bundle; 
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.speechrecognition.SpeechRecognition; 
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) { // Now Bundle is recognized
        super.onCreate(savedInstanceState);
        registerPlugin(SpeechRecognition.class); // ✅ Register the plugin
    }
}
