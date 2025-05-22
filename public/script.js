let pašreizējāTēma = "";

async function jautajumaUzdosana() {
  const temats = document.getElementById("temataIzvele").value.trim();
  if (!temats) {
    alert("Lūdzu, ievadi tematu!");
    return;
  }

  pašreizējāTēma = temats;

  const response = await fetch("/api/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: temats }),
  });

  if (!response.ok) {
    alert("Neizdevās sazināties ar serveri.");
    return;
  }

  const data = await response.json();

  if (!data.question || typeof data.question !== "string") {
    alert("Serveris neatgrieza derīgu jautājumu.");
    return;
  }

  paradiJautajumu(data.question);
}

function paradiJautajumu(jautajums) {
  let variants = jautajums.replace(/^Vai tu labāk\s+/i, "").replace(/\?$/, "");

  let [variantsA, variantsB] = variants.split(" vai ");

  if (!variantsA || !variantsB) {
    alert("Kļūda: Nevarēja sadalīt jautājumu divos variantos.");
    return;
  }

  const jautajumaTeksts = `Vai tu labāk ${variantsA.trim()} vai ${variantsB.trim()}?`;

  const darbibasVards = variantsA.trim().split(" ")[0];

  const atbildeA = variantsA.trim().startsWith(darbibasVards)
    ? variantsA.trim().substring(darbibasVards.length).trim()
    : variantsA.trim();

  const atbildeB = variantsB.trim().startsWith(darbibasVards)
    ? variantsB.trim().substring(darbibasVards.length).trim()
    : variantsB.trim();

  document.getElementById("jautajumaTeksts").innerText = jautajumaTeksts;
  document.getElementById("izveleA").innerText = atbildeA;
  document.getElementById("izveleB").innerText = atbildeB;

  document.getElementById("temataIzvelesAile").classList.add("hidden");
  document.getElementById("jautajums").classList.remove("hidden");
}


function nakamaisJautajums() {
  jautajumaUzdosana(); // Saglabā tēmu un ģenerē nākamo jautājumu
}

function mainitTemu() {
  document.getElementById("jautajums").classList.add("hidden");
  document.getElementById("temataIzvelesAile").classList.remove("hidden");
  document.getElementById("temataIzvele").value = "";
}

function selectChoice(choice) {
  alert(`Tu izvēlējies ${choice === "A" ? "pirmo" : "otro"} variantu!`);
}