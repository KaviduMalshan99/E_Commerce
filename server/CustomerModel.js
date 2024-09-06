const mongoose = require("mongoose");
const USER_ROLES = require("./constants/roles");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  UserId: { type: Number, unique: true },
  firstName: String,
  lastName: String,

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  contact: String,


  cartItems: [{
    size: String, 
    name: String, 
    count: Number, 
    images: [String], 
    price: Number 
}],

  profileUrl: {
    type: String,
    default:
      "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F51%2Fe0%2Fd5%2F51e0d5aa27808ce689e3dd5a5cd7685a.png&tbnid=ljs5X73e4N_zZM&vet=1&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fman-thinking-png-man-images-free-download-transparent-png-is-pure-and-creative-png-image-uploaded-by-designer-to-search-more-fr--982629212423802744%2F&docid=_gVTvuugiZ7OhM&w=860&h=838&hl=en-GB&source=sh%2Fx%2Fim%2Fm1%2F4",
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER,
  },


});

CustomerSchema.pre("save", function (next) {
  const customer = this;
  const randomUserId = Math.floor(100000 + Math.random() * 900000);
  customer.UserId = randomUserId;
  next();
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
