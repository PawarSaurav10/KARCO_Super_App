class UserInfo {
    constructor(
      userType,
      userId,
      userTypeRef,
      Name,
      email,
      mobileNo,
      gender,
      hasDemographicInfo
    ) {
      this.userType = userType;
      this.userId = userId;
      this.userTypeRef = userTypeRef;
      this.Name = Name;
      this.email = email;
      this.mobileNo = mobileNo;
      this.gender = gender;
      this.hasDemographicInfo = hasDemographicInfo;
    }
  }
  
  export default UserInfo