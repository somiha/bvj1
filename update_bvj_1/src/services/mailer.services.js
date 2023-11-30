const welcomeMail = (to, username) => {
  return {
    from: 'bvj@gmail.com',
    to: to,
    subject: 'Welcome to BVJ - the biggest veterenary journal of Bangladesh',
    html: `Dear ${username} <br />

		I am delighted to inform you that your registration on our website, Bangladesh Veterinary Journal (BVJ), has been successfully completed! We are excited to have you as a member of our community of veterinary professionals and enthusiasts. <br />
		
		As a registered member, you will have access to exclusive content on our website, including research articles, news, and events related to the veterinary industry in Bangladesh. You will also be able to connect with other members and participate in discussions on topics that matter to you. <br />
		
		We are committed to providing a platform for sharing knowledge, research, and ideas related to animal health, welfare, and management in Bangladesh. Your membership will help us build a stronger community and enable us to promote the veterinary profession in our country. <br />
		
		Thank you for joining us and being a part of the BVJ community! We look forward to your active participation and contributions. <br />
		
		Best regards, <br />
		BVJ Team.`
  }
}

module.exports = {
  welcomeMail
};