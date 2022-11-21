const formReferences = {
  login: document.querySelector(".login-form"),
  translate: document.querySelector(".translate-form"),
};

const translateHandler = (() => {
  const _form = formReferences["translate"];
  const _textarea = document.querySelector("#translated-text");
  // methods
  async function translate(sourceLang, toLang, text) {
    const dat = await fetch("http://localhost:3003/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toLang, sourceLang, text }),
    });
    return dat;
  }
  _form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = _form.elements;
    const sourceLang = inputs["source-lang"].value;
    const toLang = inputs["to-lang"].value;
    const text = inputs["text"].value;
    const res = await translate(sourceLang, toLang, text);
    const dat = await res.json();
    _textarea.textContent = dat.text;
    // now finally
  });
  // event listener
})();

const loginHandler = (() => {
  const _form = formReferences["login"];

  // methods
  async function loginAPICall(username, password) {
    const dat = await fetch("http://localhost:3003/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return dat;
  }

  // event listener
  _form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = _form.elements;
    const username = inputs["username"].value;
    const password = inputs["password"].value;
    const res = await loginAPICall(username, password);
    const data = await res.json();
    if (data.status === "ok") {
      // re render
      formReferences["translate"].classList.remove("hidden");
      _form.classList.add("hidden");
    }
  });
})();
