FROM reactnativecommunity/react-native-android:latest

WORKDIR /app

COPY . .

RUN npm ci

RUN npm i -g react-native-cli

RUN react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

RUN "./gradle assembleDebug"




