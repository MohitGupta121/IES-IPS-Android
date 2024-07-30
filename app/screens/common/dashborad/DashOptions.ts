export const StudentDashOptions = [
  {
    name : "Attendance",
    icon : "book-open",
    to : "Attendance"
  },
  // {
  //   name : "Calender",
  //   icon : "calendar",
  //   to : "Calender"
  // },
  {
    name : "Result",
    icon : "award",
    to : "Result"
  },
  {
    name : "Feedback",
    icon : "check-square",
    to : "Feedback"
  },
] as const;


export const StaffDashOptions = [
  {
    name : "Attendance Panel",
    icon : "edit",
    to : "Attendance Panel"
  },
  {
    name : "Leave Application",
    icon : "briefcase",
    to : "Leave Application"
  },
  // {
  //   name : "Sechdule",
  //   icon : "clock",
  //   to : "Sechdule"
  // },
  {
    name : "Notify",
    icon : "message-circle",
    to : "Notify Batches"
  },
] as const;