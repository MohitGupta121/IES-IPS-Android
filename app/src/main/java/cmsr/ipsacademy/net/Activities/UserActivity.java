package cmsr.ipsacademy.net.Activities;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceIdReceiver;
import com.google.firebase.messaging.FirebaseMessaging;

import cmsr.ipsacademy.net.R;
import cmsr.ipsacademy.net.Util.SharedPreference;
import cmsr.ipsacademy.net.messaging.FcmNotificationsSender;
import cmsr.ipsacademy.net.messaging.FirebaseMessagingService;

public class UserActivity extends AppCompatActivity {


    private EditText notificationTitle;
    private EditText notificationMessage;
    private Button notificationSendButton;
    private String tokenHOD;
    private String tokenPrinciple;
    private String tokenTeacher;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);

        notificationTitle = findViewById(R.id.noti_title);
        notificationMessage = findViewById(R.id.noti_message);
        notificationSendButton = findViewById(R.id.noti_send);

        SharedPreference sharedPreference = new SharedPreference(this);
        FirebaseMessaging.getInstance().subscribeToTopic("all");


        SharedPreferences prefs = getSharedPreferences("TOKEN_PREF", MODE_PRIVATE);
        String token = prefs.getString("token", "");

        Log.e("NEW_INACTIVITY_TOKEN", token);

        final String[] newToken = new String[1];



        if (sharedPreference.getValueString("role").equals("Principle")) {

            if (TextUtils.isEmpty(token)) {
                FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        newToken[0] = task.getResult();
                        Log.e("newToken", newToken[0]);
                        SharedPreferences.Editor editor = getSharedPreferences("TOKEN_PREF", MODE_PRIVATE).edit();
                        if (token!=null){
                            editor.putString("token", newToken[0]);
                            editor.apply();
                        }
                    }
                });

            }

//            FirebaseMessaging.getInstance().getToken()
//                    .addOnCompleteListener(new OnCompleteListener<String>() {
//                        @Override
//                        public void onComplete(@NonNull Task<String> task) {
//                            if (!task.isSuccessful()) {
//                                return;
//                            }
//                            String token = task.getResult();
//                            System.out.println("TOKEN" + token);
//                           sharedPreference.save("principle", token);
//                           System.out.println("TOKEN22" + sharedPreference.getValueString("principle"));
//                        }
//                    });
        }
//        if (sharedPreference.getValueString("role").equals("Teacher")) {
            FirebaseMessaging.getInstance().getToken().addOnSuccessListener(this :: tokenPrincipleKey);
//        }

        Log.e("mmmmmm", "hsh"+tokenPrinciple);
        tokenTeacher = sharedPreference.getValueString("teacher");

        System.out.println("TOK" + "bhhhb"+tokenTeacher);
        System.out.println("TOKm" + sharedPreference.getValueString("teacher"));

        notificationSendButton.setOnClickListener(view -> {
            if (!notificationTitle.getText().toString().isEmpty() && !notificationMessage.getText().toString().isEmpty()){

                FcmNotificationsSender notificationsSender = new FcmNotificationsSender(token, notificationTitle.getText().toString(), notificationMessage.getText().toString(), getApplicationContext(), UserActivity.this);
                notificationsSender.SendNotifications();

            }else{
                Toast.makeText(this, "The noti details is Empty", Toast.LENGTH_SHORT).show();
            }
        });

//        notificationSendButton.setOnClickListener(view -> {
//            if (!notificationTitle.getText().toString().isEmpty() && !notificationMessage.getText().toString().isEmpty()){
//
//                if (sharedPreference.getValueString("role").equals("Principle")){
//                    FcmNotificationsSender notificationsSender = new FcmNotificationsSender(tokenHOD, notificationTitle.getText().toString(), notificationMessage.getText().toString(), getApplicationContext(), UserActivity.this);
//                    notificationsSender.SendNotifications();
//                }else if (sharedPreference.getValueString("role").equals("HOD")){
//                    FcmNotificationsSender notificationsSender = new FcmNotificationsSender(
//                            "eG6zYbHsTx-SO52dXbsz0R:APA91bEiZVbOcv4cz6e1posjIxEqc-VEn7-EMCAROcqju5GQI7X4BggrvjsB1UR5LEAH7aqrrGlu79In9WxSKBYSAABRxJY4ul96E91CxboHZRxnjeRWMVtuumqLUpBwBiJB-4mVvpon"
//                            , notificationTitle.getText().toString(), notificationMessage.getText().toString(), getApplicationContext(), UserActivity.this);
//                    notificationsSender.SendNotifications();
//                }
//
//            }else{
//                Toast.makeText(this, "The noti details is Empty", Toast.LENGTH_SHORT).show();
//            }
//        });


    }

    private void tokenPrincipleKey(String s) {
        tokenPrinciple = s;
        Log.e("mmmmmm", "hsh"+tokenPrinciple);
    }


}
