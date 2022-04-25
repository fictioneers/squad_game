// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // Get token
  // Get user state
  // If answer correct
    // Mark question complete
    // Mark answer complete
    // Progress user
    // If finished
      // Return answer content & finished
    // Else
      // Return answer content & next question content
  // Else
    // Mark question complete
    // Return incorrect response
  res.status(200).json({ name: 'John Doe' })
}
