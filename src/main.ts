import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
interface UtazasiAjánlat {
	title: string;
	content: string;
	img: string;
}
const ajanlatokUrl = "https://petrik-utazas-default-rtdb.europe-west1.firebasedatabase.app/travelDestinations.json";
const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
	throw new Error("Az alkalmazás konténere nem található.");
}
let utazasiAjanlatok: UtazasiAjánlat[] = [];
app.innerHTML = `
	<header class="fejlec">
		<div class="container py-4 py-md-5">
			<p class="felirat mb-2" style="color: goldenrod;">M&M  Utazási Iroda</p>
			<h1 class="display-5 fw-bold mb-2">Találd meg az uti celod</h1>
			<p class="lead mb-0">Válogass legjobb ajánlataink közül, és induljon a kaland!!</p>
		</div>
	</header>
   <hr width="100%;" color="goldenrod" size="15">
	<main class="container py-4 py-md-5">
		<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
			<h2 class="h3 mb-0">Legtrendibb Utazási ajánlatok</h2>
			<span id="ajanlat-darabszam" class="text-secondary"></span>
		</div>
		<p id="allapot" class="text-secondary" role="status"></p>
		<div id="ajanlatok" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"></div>
    <div class="container">
    <hr width="100%;" color="black" size="15">
    <h1>új utazási űrlap</h1>

    <form id="entryForm">
      <label for="title">Cím</label>
      <input id="title" name="title" type="text" required maxlength="120" placeholder="Add meg a címet" />

      <label for="description">Leírás</label>
      <textarea id="description" name="description" required placeholder="Írd le röviden..."></textarea>
      <br><br>
      <label>Kép kiválasztása</label>
      <div class="images" id="imageOptions">
        <label class="image-option" data-url="https://picsum.photos/id/84/300/300">
          <input type="radio" name="image" value="https://picsum.photos/id/84/300/300" />
          <img src="https://picsum.photos/id/84/300/300" alt="Kép 84" />
        </label>

        <label class="image-option" data-url="https://picsum.photos/id/82/300/300">
          <input type="radio" name="image" value="https://picsum.photos/id/82/300/300" />
          <img src="https://picsum.photos/id/82/300/300" alt="Kép 82" />
        </label>

        <label class="image-option" data-url="https://picsum.photos/id/96/300/300">
          <input type="radio" name="image" value="https://picsum.photos/id/96/300/300" />
          <img src="https://picsum.photos/id/96/300/300" alt="Kép 96" />
        </label>
      </div>
<br><br>
      <div class="actions">
        <button type="submit">Mentés</button>
        <button type="reset" style="background-color: #dc3545; color: white;">Űrlap törlése</button>
      </div>
    </form>

    <div id="cardsWrapper" class="cards" aria-live="polite"></div>

    <div class="export-area">
      <div style="flex:0 0 auto;">
        <button id="exportBtn">Export</button>
      </div>
      <textarea id="exportOutput" readonly placeholder="    "></textarea>
    </div>
  </div>
   
	</main>
  <hr width="100%;" color="goldenrod" size="15">
`;
async function ajanlatokBetoltese() {
  const allapotElem = document.querySelector<HTMLParagraphElement>("#allapot");
  const ajanlatokElem = document.querySelector<HTMLDivElement>("#ajanlatok");
  const darabszamElem = document.querySelector<HTMLSpanElement>("#ajanlat-darabszam")

  if (!allapotElem || !ajanlatokElem || !darabszamElem) {
    throw new Error("A szükséges HTML elemek nem találhatók.");
  }
  allapotElem.textContent = "Ajánlatok betöltése...";
  try {
    const response = await fetch(ajanlatokUrl);
    if (!response.ok) {
      throw new Error(`Hiba történt az ajánlatok betöltése során: ${response.statusText}`);
    }
    const data: Record<string, UtazasiAjánlat> = await response.json();
    utazasiAjanlatok = Object.values(data);

    ajanlatokElem.innerHTML = utazasiAjanlatok.map(ajanlat => `
      <div class="col">
        <div class="card h-100">
          <img src="${ajanlat.img}" class="card-img-top" alt="${ajanlat.title}">
          <div class="card-body">
            <h5 class="card-title">${ajanlat.title}</h5>
            <p class="card-text">${ajanlat.content}</p>
          </div>
        </div>
      </div>
    `).join("");

    darabszamElem.textContent = `${utazasiAjanlatok.length} ajánlat található.`;
    allapotElem.textContent = "";
  } catch (error) {
    console.error(error);
    allapotElem.textContent = "Hiba történt az ajánlatok betöltése során.";
  }
}


// export function exportAjanlatok() {
//   const exportOutput = document.querySelector<HTMLTextAreaElement>("#exportOutput");
//   if (!exportOutput) {
//     throw new Error("Az export kimeneti mező nem található.");
//   }
//   exportOutput.value = JSON.stringify(utazasiAjanlatok, null, 2);
// }
// export function setupExportButton() {
//   const exportBtn = document.querySelector<HTMLButtonElement>("#exportBtn");
//   if (!exportBtn) {
//     throw new Error("Az export gomb nem található.");
//   }
//   exportBtn.addEventListener("click", exportAjanlatok);
// }
ajanlatokBetoltese();
export function exportAjanlatok() {
  const exportOutput = document.querySelector<HTMLTextAreaElement>("#exportOutput");
  if (!exportOutput) {
    throw new Error("Az export kimeneti mező nem található.");
  }
  exportOutput.value = JSON.stringify(utazasiAjanlatok, null, 2);
}
export function setupExportButton() {
  const exportBtn = document.querySelector<HTMLButtonElement>("#exportBtn");
  if (!exportBtn) {
    throw new Error("Az export gomb nem található.");
  }
  exportBtn.addEventListener("click", exportAjanlatok);
}
setupExportButton();