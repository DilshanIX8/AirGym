const { contactUsSchema } = require("../../validations/public");
const { contactUsEmailTemplate } = require("../../emails/contact-us");
const { sendEmail } = require("../../utils/emails");

const contactUs = async (req, res) => {
  try {
    const data = req.body;
    // validate data in backend
    const validatedFields = contactUsSchema.safeParse(data);

    // check if validation failed and return errors
    if (!validatedFields.success) {
      return res.status(400).json({
        errors: validatedFields.error.errors,
      });
    }

    // destructure data from validated fields
    const { firstName, lastName, subject, email, message } =
      validatedFields.data;

    // setup email template
    const template = contactUsEmailTemplate(
      `${firstName} ${lastName}`,
      email,
      subject,
      message
    );
    //get recipient email from env
    const to = process.env.CONTACT_US_EMAIL;

    // if recipient email is available
    if (to) {
      const isSend = await sendEmail(
        to,
        "Contact Us message from Airgym platform",
        template,
        email
      );

      // if email not sent
      if (!isSend) {
        return res.status(500).json({
          error: "Message not sent.Please try again",
        });
      }

      //  if no error
      return res.status(200).json({
        message: "Message sent successfully",
      });
      // if recipient email is not available
    } else {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  } catch (error) {
    // if any error
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

module.exports = { contactUs };
