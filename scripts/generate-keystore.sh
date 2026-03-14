#!/bin/bash
# Generate a release keystore for Color Dash
# Run this script once, then add the credentials to gradle.properties

set -e

KEYSTORE_PATH="android/app/release.keystore"
ALIAS="color-dash-release"

if [ -f "$KEYSTORE_PATH" ]; then
  echo "⚠️  Keystore already exists at $KEYSTORE_PATH"
  echo "    Delete it first if you want to regenerate."
  exit 1
fi

echo "🔑 Generating release keystore for Color Dash..."
echo ""

keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore "$KEYSTORE_PATH" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

echo ""
echo "✅ Keystore generated at: $KEYSTORE_PATH"
echo ""
echo "📋 Add these lines to android/gradle.properties:"
echo ""
echo "   COLORDASH_UPLOAD_STORE_FILE=release.keystore"
echo "   COLORDASH_UPLOAD_STORE_PASSWORD=<your-store-password>"
echo "   COLORDASH_UPLOAD_KEY_ALIAS=$ALIAS"
echo "   COLORDASH_UPLOAD_KEY_PASSWORD=<your-key-password>"
echo ""
echo "📋 For EAS cloud builds, add them as secrets:"
echo "   eas secret:create --name COLORDASH_UPLOAD_STORE_PASSWORD --value <password>"
echo "   eas secret:create --name COLORDASH_UPLOAD_KEY_PASSWORD --value <password>"
echo ""
echo "⚠️  IMPORTANT: Keep this keystore safe! You cannot replace it once"
echo "    uploaded to Google Play. Back it up securely."
