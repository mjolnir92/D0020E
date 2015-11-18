package com.mugsan.d3testclient;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

public class MainActivity extends Activity implements SensorEventListener {

    static final int testPort = 12345;
    static final int BUFFER_SIZE = 1024;

    private DatagramSocket socket;
    private byte[] buffer;
    private InetAddress addr;
    private JSONObject out;
    private SensorManager mSensorManager;
    private Sensor mLinearSensor;
    private boolean connected;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.mSensorManager = (SensorManager)this.getSystemService(Context.SENSOR_SERVICE);
        this.mLinearSensor  = this.mSensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);

        this.buffer = new byte[BUFFER_SIZE];

        this.out = new JSONObject();
    }

    public void onClick(View view) {
        switch(view.getId()){
            case R.id.button_connect:{
                String addr = ((EditText)findViewById(R.id.edit_host)).getText().toString();

                try {
                    this.addr = InetAddress.getByName(addr);
                    this.socket = new DatagramSocket();
                } catch (UnknownHostException | SocketException e) {
                    e.printStackTrace();
                }
                this.connected = true;

                break;
            }
        }
    }

    private void sendMessage(float x, float y, float z) throws IOException, JSONException {


        this.out.put("x", x);
        this.out.put("y", y);
        this.out.put("z", z);
        this.out.put("time", System.currentTimeMillis());

        this.buffer = this.out.toString().getBytes("utf-8");
        final DatagramPacket dp = new DatagramPacket(this.buffer, this.buffer.length, this.addr, testPort);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    socket.send(dp);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (!this.connected){
            return;
        }

        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        try {

            sendMessage(x,y,z);

        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }


    @Override
    protected void onStart() {
        super.onStart();
        this.mSensorManager.registerListener(this, mLinearSensor, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @Override
    protected void onStop() {
        super.onStop();
        this.mSensorManager.unregisterListener(this);
    }

}
