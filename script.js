document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fxInput = document.getElementById('fungsi').value;
    const x0 = parseFloat(document.getElementById('x0').value);
    const h = parseFloat(document.getElementById('h').value);
    const n = parseInt(document.getElementById('n').value);
    const ordo = parseInt(document.getElementById('ordo').value);
    const metode = document.getElementById('metode').value;
    const f = math.compile(fxInput);
    let steps = `🔹 Langkah-langkah:\n`;

    steps += `1. Fungsi: f(x) = ${fxInput}\n   Titik x₀ = ${x0}, h = ${h}, Turunan ke-${n}, Orde ${ordo}\n`;

    const evalF = x => f.evaluate({x});

    function backwardDiff() {
        let result, formula, subs = '';
        if (n === 1) {
            if (ordo === 1) {
                formula = "f'(x₀) ≈ (f(x₀) - f(x₀ - h)) / h";
                const f0 = evalF(x0), f1 = evalF(x0 - h);
                result = (f0 - f1) / h;
                subs = `= (${f0} - ${f1}) / ${h}`;
            } else if (ordo === 2) {
                const f0 = evalF(x0), f1 = evalF(x0 - h), f2 = evalF(x0 - 2*h);
                formula = "f'(x₀) ≈ (3f(x₀) - 4f(x₀ - h) + f(x₀ - 2h)) / 2h";
                result = (3*f0 - 4*f1 + f2) / (2*h);
                subs = `= (3×${f0} - 4×${f1} + ${f2}) / (2×${h})`;
            } else if (ordo === 3) {
                const f0 = evalF(x0), f1 = evalF(x0 - h), f2 = evalF(x0 - 2*h), f3 = evalF(x0 - 3*h);
                formula = "f'(x₀) ≈ (11f(x₀) - 18f(x₀ - h) + 9f(x₀ - 2h) - 2f(x₀ - 3h)) / 6h";
                result = (11*f0 - 18*f1 + 9*f2 - 2*f3) / (6*h);
                subs = `= (11×${f0} - 18×${f1} + 9×${f2} - 2×${f3}) / (6×${h})`;
            }
        } else if (n === 2) {
            if (ordo === 1) {
                const f0 = evalF(x0), f1 = evalF(x0 - h), f2 = evalF(x0 - 2*h);
                formula = "f''(x₀) ≈ (f(x₀) - 2f(x₀ - h) + f(x₀ - 2h)) / h²";
                result = (f0 - 2*f1 + f2) / (h*h);
                subs = `= (${f0} - 2×${f1} + ${f2}) / (${h}²)`;
            } else if (ordo === 2) {
                const f0 = evalF(x0), f1 = evalF(x0 - h), f2 = evalF(x0 - 2*h), f3 = evalF(x0 - 3*h);
                formula = "f''(x₀) ≈ (2f(x₀) - 5f(x₀ - h) + 4f(x₀ - 2h) - f(x₀ - 3h)) / h²";
                result = (2*f0 - 5*f1 + 4*f2 - f3) / (h*h);
                subs = `= (2×${f0} - 5×${f1} + 4×${f2} - ${f3}) / (${h}²)`;
            }
        }
        return { formula, subs, result };
    }

    function centralDiff() {
        let result, formula, subs = '';
        if (n === 1) {
            if (ordo === 2) {
                const f1 = evalF(x0 + h), f2 = evalF(x0 - h);
                formula = "f'(x₀) ≈ (f(x₀ + h) - f(x₀ - h)) / 2h";
                result = (f1 - f2) / (2*h);
                subs = `= (${f1} - ${f2}) / (2×${h})`;
            } else if (ordo === 4) {
                const f1 = evalF(x0 + 2*h), f2 = evalF(x0 + h), f3 = evalF(x0 - h), f4 = evalF(x0 - 2*h);
                formula = "f'(x₀) ≈ (-f(x₀ + 2h) + 8f(x₀ + h) - 8f(x₀ - h) + f(x₀ - 2h)) / 12h";
                result = (-f1 + 8*f2 - 8*f3 + f4) / (12*h);
                subs = `= (-${f1} + 8×${f2} - 8×${f3} + ${f4}) / (12×${h})`;
            }
        } else if (n === 2) {
            if (ordo === 2) {
                const f1 = evalF(x0 + h), f0 = evalF(x0), f2 = evalF(x0 - h);
                formula = "f''(x₀) ≈ (f(x₀ + h) - 2f(x₀) + f(x₀ - h)) / h²";
                result = (f1 - 2*f0 + f2) / (h*h);
                subs = `= (${f1} - 2×${f0} + ${f2}) / (${h}²)`;
            } else if (ordo === 4) {
                const f1 = evalF(x0 + 2*h), f2 = evalF(x0 + h), f0 = evalF(x0), f3 = evalF(x0 - h), f4 = evalF(x0 - 2*h);
                formula = "f''(x₀) ≈ (-f(x₀ + 2h) + 16f(x₀ + h) - 30f(x₀) + 16f(x₀ - h) - f(x₀ - 2h)) / 12h²";
                result = (-f1 + 16*f2 - 30*f0 + 16*f3 - f4) / (12*h*h);
                subs = `= (-${f1} + 16×${f2} - 30×${f0} + 16×${f3} - ${f4}) / (12×${h}²)`;
            }
        }
        return { formula, subs, result };
    }

    let data;
    if (metode === "mundur") {
        data = backwardDiff();
        steps += `2. Gunakan Rumus Selisih Mundur:\n   ${data.formula}\n`;
    } else {
        data = centralDiff();
        steps += `2. Gunakan Rumus Selisih Pusat:\n   ${data.formula}\n`;
    }

    steps += `3. Substitusi nilai:\n   ${data.subs}\n`;
    steps += `4. Hasil Akhir: ${data.result}\n`;

    document.getElementById('output').textContent = steps;
});
