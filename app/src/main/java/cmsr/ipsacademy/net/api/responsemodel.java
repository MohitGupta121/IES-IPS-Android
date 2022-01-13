package cmsr.ipsacademy.net.api;

public class responsemodel
{
   String message;
   String is_student;

   public responsemodel(String message, String is_student) {
      this.message = message;
      this.is_student = is_student;
   }

   public String getIs_student() {
      return is_student;
   }

   public void setIs_student(String is_student) {
      this.is_student = is_student;
   }

   public responsemodel(String message) {
      this.message = message;
   }

   public responsemodel() {
   }

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }
}
