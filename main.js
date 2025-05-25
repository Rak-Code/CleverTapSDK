function isValidPhone(phone) {
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phone);
}

function getUserDetails() {
  return {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    dob: new Date(document.getElementById('dob').value)
  };
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function validateInputs(name, email, phone, dob) {
  if (!name || !email || !phone || !dob || !isValidDate(dob)) {
    Swal.fire({
      icon: 'error',
      title: 'Please fill all fields with valid info including a valid Date of Birth.',
      showConfirmButton: false,
      timer: 1800
    });
    return false;
  }
  if (!isValidPhone(phone)) {
    Swal.fire({
      icon: 'error',
      title: 'Phone number must be in format +[country code][number], e.g. +911234567890',
      showConfirmButton: false,
      timer: 2000
    });
    return false;
  }
  return true;
}

// NOTE: Remove console.log statements containing sensitive info before deploying to production!

function loginUser() {
  const { name, email, phone, dob } = getUserDetails();
  if (!validateInputs(name, email, phone, dob)) return;
  clevertap.onUserLogin.push({
    "Site": {
      "Name": name,
      "Email": email,
      "Phone": phone,
      "DOB": dob // Date object
    }
  });
  console.log("Pushing login for user:", { name, email, phone, dob });
  Swal.fire({
    icon: 'success',
    title: 'Login Event Pushed!',
    showConfirmButton: false,
    timer: 1500
  });
}

function pushProfile() {
  const { name, email, phone, dob } = getUserDetails();
  if (!validateInputs(name, email, phone, dob)) return;
  clevertap.profile.push({
    "Site": {
      "Name": name,
      "Email": email,
      "Phone": phone,
      "DOB": dob // Date object
    }
  });
  console.log("Pushing profile for user:", { name, email, phone, dob });
  Swal.fire({
    icon: 'success',
    title: 'Profile Updated!',
    showConfirmButton: false,
    timer: 1500
  });
}

function askForPush() {
  // 1. Check if HTTPS or localhost
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  if (!isSecure) {
    Swal.fire({
      icon: 'error',
      title: 'Push notifications require HTTPS or localhost.',
      text: 'Please serve your site over HTTPS or use localhost for push notifications to work.'
    });
    return;
  }
  // 2. Check if CleverTap SDK is loaded
  if (typeof clevertap === 'undefined' || typeof clevertap.notifications === 'undefined') {
    Swal.fire({
      icon: 'error',
      title: 'CleverTap SDK not loaded',
      text: 'Please ensure the CleverTap JS SDK is loaded before requesting push notifications.'
    });
    return;
  }
  // 3. Try to register push
  try {
    clevertap.notifications.push({
      "titleText": 'Would you like to receive Push Notifications?',
      "bodyText": 'We promise to only send you relevant content and give you updates on your transactions',
      "okButtonText": 'Sign me up!',
      "rejectButtonText": 'No thanks',
      "askAgainTimeInSeconds": 5,
      "okButtonColor": '#f28046'
    });
    console.log("Push notification permission requested");
    Swal.fire({
      icon: 'info',
      title: 'Push Notification Request Sent!\nIf you do not see a prompt, check your browser notification permissions and reset them for this site.',
      showConfirmButton: false,
      timer: 2500
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Push Notification Error',
      text: err.message || 'Failed to trigger push notification dialog.'
    });
  }
}


function raiseEvent() {
  const { name, email, phone, dob } = getUserDetails();
  if (!validateInputs(name, email, phone, dob)) return;
  const eventData = {
    "StringProp": "HelloWorld",
    "IntegerProp": 42,
    "FloatProp": 3.14,
    "DateTimeProp": dob.toISOString().split('T')[0]
  };
  clevertap.event.push("UserCustomEvent", eventData);
  console.log("Custom Event Raised! Data:", eventData);
  Swal.fire({
    icon: 'success',
    title: 'Custom Event Raised!',
    showConfirmButton: false,
    timer: 1500
  });
}
