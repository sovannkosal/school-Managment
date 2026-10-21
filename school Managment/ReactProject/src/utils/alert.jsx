import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const showAlert = (icon, title, timer = 2000) => {
  return Swal.fire({
    icon,
    title,
    timer,
    timerProgressBar: true,
    didOpen: () => {
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.fontFamily = "sans-serif";
      }
    },
  });
};

export const showConfirm = (title, text, confirmButtonText = "Yes, confirm!") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText,
    didOpen: () => {
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.fontFamily = "sans-serif";
      }
    },
  });
};
 