package cmsr.ipsacademy.net.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;


import com.google.firebase.messaging.FirebaseMessaging;

import cmsr.ipsacademy.net.R;
import cmsr.ipsacademy.net.helpers.SharedPreferencesHelper;
import cmsr.ipsacademy.net.messaging.FcmNotificationsSender;

public class UserActivity extends AppCompatActivity {

    private EditText notificationTitle;
    private EditText notificationMessage;
    private Button notificationSendButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);

        notificationTitle = findViewById(R.id.noti_title);
        notificationMessage = findViewById(R.id.noti_message);
        notificationSendButton = findViewById(R.id.noti_send);


        SharedPreferencesHelper sharedPreferencesHelper = new SharedPreferencesHelper(this);


        try {
            Log.i("role", sharedPreferencesHelper.getValueString("role"));
            if (sharedPreferencesHelper.getValueString("role").equals("Teacher")) {
                FirebaseMessaging.getInstance().subscribeToTopic("all");
            }
            if (sharedPreferencesHelper.getValueString("role").equals("Principal")) {
                FirebaseMessaging.getInstance().subscribeToTopic("all");
            }
        }catch (Exception e){
            Log.e("e", e.toString());
        }

        notificationSendButton.setOnClickListener(view -> {
            if (!notificationTitle.getText().toString().isEmpty() && !notificationMessage.getText().toString().isEmpty()){

                try {
                    if (sharedPreferencesHelper.getValueString("role").equals("Principal")) {
                        FcmNotificationsSender notificationsSender = new FcmNotificationsSender("/topics/all", notificationTitle.getText().toString(), notificationMessage.getText().toString(), getApplicationContext(), UserActivity.this);
                        notificationsSender.SendNotifications();
                        notificationTitle.setText("");
                        notificationMessage.setText("");
                    }
                    if (sharedPreferencesHelper.getValueString("role").equals("HOD")) {
                        FcmNotificationsSender notificationsSender = new FcmNotificationsSender("/topics/all", notificationTitle.getText().toString(), notificationMessage.getText().toString(), getApplicationContext(), UserActivity.this);
                        notificationsSender.SendNotifications();
                        notificationTitle.setText("");
                        notificationMessage.setText("");
                    }
                }catch (Exception e){
                    Log.e("e", e.toString());
                }

            }else{
                Toast.makeText(this, "The notification details is Empty", Toast.LENGTH_SHORT).show();
            }
        });

    }


}
