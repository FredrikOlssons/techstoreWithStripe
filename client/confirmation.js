

const validate = async () => {
  try {
    const sessionParams = new URLSearchParams(window.location.search);
    const sessionId = sessionParams.get('session_id');
    

    if (!sessionId) {
      window.location.replace('http://localhost:3000')
      throw new Error("Session id missing.")
    }

    const response = await fetch('/confirm/' + sessionId, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    const {notPaid} = await response.json();
    if(notPaid){
      window.location.replace('http://localhost:3000')
    }
  } catch (err) {
    console.error(err, 'something went wrong')
    
  }
}

async function load() {
  const confirm = await validate()

}
load()