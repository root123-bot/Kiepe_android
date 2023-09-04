import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants/domain";

// ALL METHODS WHICH RETURN PROMISE SHOULD HAVE 'async'
// as you see here we have a warning in most of function
// that we should include 'async' keyword and as you see here
// we return Promise.resolve() and Promise.reject() in our functions

export const executeUserMetadata = async (uid) => {
  let user_id = uid ? uid : await AsyncStorage.getItem("uid");
  return fetch(`${BASE_URL}/api/userdetails/`, {
    method: "POST",
    body: JSON.stringify({
      user_id: user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200) {

        if (res.status === 404) {
          throw new Error(`Unrecognized user group ${user_id}`)
        }
        res.json().then(data => {
          console.log("THIS IS WHAT WE RESOLVE ", data.details)
          throw new Error(data.details)
        })
      }
      return res.json();
    })
    .then((resData) => {
      return Promise.resolve(resData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const isUserExist = (phone_number) => {
  return fetch(`${BASE_URL}/api/isuserexist/`, {
    method: "POST",
    body: JSON.stringify({
      phone: phone_number,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        // i throw this error and it will be catched by the catch statement below..
        throw new Error("Server error");
      }
      // response.json();
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => {
      // if you return Promise.reject({error}) it will not be executed in then statement it will be executed in catch statement..
      // if you reject then you should catch it when executing this function..
      return Promise.reject(error);
    });
};

export const getOTP = (phone_number) => {
  return fetch(`${BASE_URL}/api/sendotp/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        // i throw this error and it will be catched by the catch statement below..
        throw new Error("Unable to send OTP");
      }
      // response.json();
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => {
      // if you return Promise.reject({error}) it will not be executed in then statement it will be executed in catch statement..
      // if you reject then you should catch it when executing this function..
      return Promise.reject({ error });
    });
};

export const validateOTP = (phone_number, otp) => {
  return fetch(`${BASE_URL}/api/validateotp/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      otp,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        // i throw this error and it will be catched by the catch statement below..
        throw new Error("OTP validation failed");
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => Promise.reject({ error }));
};

export const registerUser = (phone_number, usergroup, pin, deviceID) => {
  return fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    body: JSON.stringify({
      phone_number,
      usergroup,
      pin,
      deviceID,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Namba ishasajiliwa");
      }
    })
    .then((data) => Promise.resolve({ data }))
    .catch((error) => Promise.reject({ error }));
};

export const loginUser = (phone, password) => {
  return fetch(`${BASE_URL}/api/login/`, {
    method: "POST",
    body: JSON.stringify({
      phone,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // remember we have status of 200 also if user have invalid data
      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 401) {
          // the user group is not recognized
          throw new Error(`Unrecognized user group`)
        }
        throw new Error("Server error");
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const completeKibandaProfile = (fdata, headers) => {
  return fetch(`${BASE_URL}/api/completekibandaprofile/`, {
    method: "POST",
    body: fdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject(error));
};

export const editKibandaProfile = async (fdata, headers) => {
  return fetch(`${BASE_URL}/api/editkibandaprofile/`, {
    method: "POST",
    body: fdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const editKibandaDefaultMenu = async (user_id, mt, default_id) => {
  return fetch(`${BASE_URL}/api/editkibandadefaultmenu/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      mt,
      default_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const rateKibanda = async (mt) => {
  return fetch(`${BASE_URL}/api/addkibandarating/`, {
    method: "POST",
    body: JSON.stringify({
      user_id: mt.user_id,
      kibanda_id: mt.kibanda_id,
      rating: mt.rating,
      comment: mt.comment,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const addKibandaDefaultMenu = (user_id, mt) => {
  return fetch(`${BASE_URL}/api/createdefaultmenuitem/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      mt,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const fetchKibandaReviews = (user_id) => {
  return fetch(`${BASE_URL}/api/kibandareviews/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const markNotificationAsRead = (notification_id) => {
  return fetch(`${BASE_URL}/api/marknotificationasread/`, {
    method: "POST",
    body: JSON.stringify({
      notification_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const updateUserProfilePicture = (formdata, headers) => {
  return fetch(`${BASE_URL}/api/updateuserprofilepicture/`, {
    method: "POST",
    body: formdata,
    headers: headers
      ? headers
      : {
          "Content-Type": "application/json",
        },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((data) => Promise.resolve(data))
    .catch((error) => Promise.reject({ error }));
};

export const processPayments = async (metadata) => {
  const { user_id, payment_method, amount, phone_number } = metadata;

  return fetch(`${BASE_URL}/api/processpayment/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      payment_method,
      amount,
      phone_number,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server Error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

// wanatuambia tu-name hii function with "async" because kama unavyoona hapa tuna-return
// promise, si unaona tunareturn Promise.resolve(data) na Promise.reject({error})?
export const updateKibandaStatus = (metadata) => {
  const { user_id, status } = metadata;

  return fetch(`${BASE_URL}/api/updatekibandastatus/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      status,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const checkIfTodayAvailableMenuSet = async (user_id) => {
  return fetch(`${BASE_URL}/api/ismenuavailableset/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const useDefaultMenuAsTodayMenu = async (user_id) => {
  return fetch(`${BASE_URL}/api/setdefaultmenuasavailablemenu/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const addAvailableMealToday = async (user_id, menuitems) => {
  return fetch(`${BASE_URL}/api/settodayavailablemenu/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      menuitems,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const getKibandaDefaultMenu = async (user_id) => {
  return fetch(`${BASE_URL}/api/getdefaultkibandamenu/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const userdetails = async (user_id) => {
  return fetch(`${BASE_URL}/api/userdetails/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const saveDeviceNotificationToken = async (user_id, token) => {
  return fetch(`${BASE_URL}/api/savedevicenotificationtoken/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      token,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const getAvailableVibanda = async () => {
  return fetch(`${BASE_URL}/api/registeredvibanda/`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const KibandaTodayAvailableMenu = async (kibanda_id) => {
  return fetch(`${BASE_URL}/api/kibandatodayavailablemenu/`, {
    method: "POST",
    body: JSON.stringify({
      kibanda_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const pureKibandaAvailableMenuNoAutoAddDefaultMenu = async (
  kibanda_id
) => {
  return fetch(
    `${BASE_URL}/api/purekibandaavailablemenunoautoadddefaultmenu/`,
    {
      method: "POST",
      body: JSON.stringify({
        kibanda_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const manipulateTodayAvailableMenuItem = async (
  kibanda_id,
  menu_id,
  status
) => {
  return fetch(`${BASE_URL}/api/addorremovemenufromtodayavailablemenu/`, {
    method: "POST",
    body: JSON.stringify({
      kibanda_id,
      menu_id,
      status,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const placeOrder = async (user_id, metadata, phone) => {
  return fetch(`${BASE_URL}/api/createorder/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      order_metadata: metadata,
      phone,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const fetchCustomerOrders = async (user_id) => {
  return fetch(`${BASE_URL}/api/customerorders/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Server error");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const fetchKibandaOrders = async (user_id) => {
  return fetch(`${BASE_URL}/api/kibandaorders/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
      
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const customerCancelOrder = async (user_id, order_id) => {
  return fetch(`${BASE_URL}/api/customercancelorder/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      order_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const markOrderDeleted = async (order_id) => {
  return fetch(`${BASE_URL}/api/markasdeleted/`, {
    method: "POST",
    body: JSON.stringify({
      order_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const markOrderAccepted = async (order_id) => {
  return fetch(`${BASE_URL}/api/markorderaccepted/`, {
    method: "POST",
    body: JSON.stringify({
      order_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const markOrderCompleted = async (order_id) => {
  return fetch(`${BASE_URL}/api/markordercompleted/`, {
    method: "POST",
    body: JSON.stringify({
      order_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const kibandaRejectOrder = async (user_id, order_id) => {
  return fetch(`${BASE_URL}/api/markorderrejected/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      order_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const changePassword = async (
  user_id,
  old_password,
  new_password,
  confirm_password
) => {
  return fetch(`${BASE_URL}/api/changepassword/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
      old_password,
      new_password,
      confirm_password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const kibandaMarkOrderDeleted = async (order_id) => {
  return fetch(`${BASE_URL}/api/kibandamarkorderdeleted/`, {
    method: "POST",
    body: JSON.stringify({
      order_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const userNotifications = async (user_id) => {
  return fetch(`${BASE_URL}/api/fetchnotificationofuser/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Failed to fetch data.");
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const markNotificationDeleted = async (notification_id) => {
  return fetch(`${BASE_URL}/api/marknotificationdeleted/`, {
    method: "POST",
    body: JSON.stringify({
      notification_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};

export const clearAllUserNotifications = async (user_id) => {
  return fetch(`${BASE_URL}/api/clearallnotificationofuser/`, {
    method: "POST",
    body: JSON.stringify({
      user_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        response.json().then(data => {
          throw new Error(data.details)
        })
      }
    })
    .then((result) => Promise.resolve(result))
    .catch((error) => Promise.reject(error));
};
