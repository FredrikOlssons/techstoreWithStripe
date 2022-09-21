

const validate = async () => {
    try {
      const sessionParams = new URLSearchParams(window.location.search);
      const sessionId = sessionParams.get('session_id');
  
      if (!sessionId) {
        throw new Error("Session id missing.")
      }
  
      const response = await fetch('/confirm/' + sessionId, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const { confirmedOrder } = await response.json();
      return confirmedOrder;
    } catch (err) {
      console.error(err, 'something went wrong')
      // potentially redirect? 
      
    }
  }
  
  async function load() {
    const confirm = await validate()
  
  }
  load()