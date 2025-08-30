document.addEventListener('DOMContentLoaded', () => {

  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

  const dataStore = {
    meta: {
      2019: {meta:[52000,48000,42000,43000,46000,45000,47000,52000,50000,54000,48000,50000], receita:[28000,36000,32000,30000,33000,42000,38000,41000,45000,47000,41000,43000]},
      2020: {meta:[54000,50000,46000,47000,49000,48000,50000,54000,52000,56000,50000,52000], receita:[30000,38000,34000,33000,36000,44000,40000,43000,46000,48000,42000,45000]},
      2021: {meta:[56000,52000,48000,50000,52000,51000,53000,57000,55000,59000,54000,56000], receita:[32000,40000,36000,35000,38000,46000,42000,45000,48000,50000,44000,47000]}
    },
    products: {
      'Excel': {2019:[15000,16000,15500,14800,15000,17000,16500,16800,17000,17500,16000,16200],2020:[17000,17500,17200,16800,17000,18500,18000,18200,18500,19000,17800,18000],2021:[19000,18500,18200,18000,18500,20000,19500,19800,20000,20500,19800,20000]},
      'Power BI': {2019:[7000,7200,7100,6900,7000,8000,8200,8300,8500,8700,8300,8400],2020:[7500,7700,7600,7400,7600,8800,9000,9100,9300,9500,9000,9200],2021:[8200,8300,8150,8000,8200,9500,9800,9900,10100,10300,10000,10200]},
      'PowerPoint': {2019:[11000,11200,10900,10500,10800,11500,11800,12000,12200,12500,11800,11900],2020:[11500,11700,11400,11000,11300,12200,12500,12600,12800,13000,12500,12650],2021:[12000,12200,12100,11800,12100,13000,13200,13400,13600,13800,13500,13650]},
      'Python': {2019:[14000,14500,14200,13800,14000,15000,15500,15800,16000,16200,15800,15900],2020:[15000,15200,15000,14800,15000,16000,16500,16800,17000,17200,16800,16950],2021:[16000,16200,16100,15800,16000,17000,17500,17800,18000,18200,17900,18050]},
      'VBA': {2019:[9000,8500,8300,8000,8200,8800,9000,9100,9300,9400,9200,9300],2020:[9500,9200,9000,8800,9000,9600,9800,9900,10100,10200,10000,10100],2021:[10000,9800,9600,9400,9600,10200,10400,10500,10650,10800,10600,10700]},
      'Word': {2019:[8000,8200,8100,7900,8000,8400,8600,8700,8800,8900,8600,8700],2020:[8500,8700,8600,8400,8500,9000,9200,9300,9400,9500,9200,9300],2021:[9000,9200,9100,9000,9200,9600,9800,9900,10000,10100,9950,10050]}
    },
    sellers: {
      names:['Alon','Diego','Gabriel','João','Marcus','Paulo'],
      2019:[110000,80000,70000,65000,72000,68000],
      2020:[120000,85000,75000,68000,76000,72000],
      2021:[125000,90000,78000,70000,80000,75000]
    }
  };

  const palette=['#ff7a4a','#ffc46b','#6fd3e9','#9ad68b','#8b7bff','#ffd57a'];
  let currentProduct = 'Excel';

  Chart.defaults.font.family='Inter, Arial, sans-serif';
  Chart.defaults.color='#ddd';

  // META vs RECEITA
  const metaCtx = document.getElementById('metaChart').getContext('2d');
  const metaChart = new Chart(metaCtx,{
    type:'bar',
    data:{
      labels:months,
      datasets:[
        {type:'bar', label:'Meta', data:dataStore.meta[2020].meta, backgroundColor:'#ff7a4a', borderRadius:6, barThickness:18},
        {type:'line', label:'Receita', data:dataStore.meta[2020].receita, borderColor:'#fff', backgroundColor:'#fff', tension:0.35, pointRadius:3}
      ]
    },
    options:{ maintainAspectRatio:false, plugins:{legend:{labels:{color:'#e9dff0'}}}, scales:{x:{grid:{display:false}}, y:{grid:{color:'rgba(255,255,255,0.02)'}}} }
  });

  // PRODUTO
  const productCtx = document.getElementById('productChart').getContext('2d');
  const productChart = new Chart(productCtx,{
    type:'line',
    data:{ labels:months, datasets:[{ label:currentProduct, data:dataStore.products[currentProduct][2020], tension:0.25, borderColor:'#ff7a4a', pointRadius:3 }]},
    options:{ maintainAspectRatio:false, plugins:{legend:{labels:{color:'#e9dff0'}}}, scales:{x:{grid:{display:false}}} }
  });

  // VENDEDOR
  const sellerCtx = document.getElementById('sellerChart').getContext('2d');
  const sellerChart = new Chart(sellerCtx,{
    type:'bar',
    data:{ labels:dataStore.sellers.names, datasets:[{label:'Receita anual (R$)', data:dataStore.sellers[2020], backgroundColor:'#ff7a4a', barThickness:28}]},
    options:{ maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}}} }
  });

  // VENDEDOR vs PRODUTO
  const sellerProdCtx = document.getElementById('sellerProdChart').getContext('2d');
  let sellerProdChart = new Chart(sellerProdCtx,{
    type:'bar',
    data:{ labels:dataStore.sellers.names, datasets:[] },
    options:{ maintainAspectRatio:false, plugins:{legend:{labels:{color:'#e9dff0'}}}, scales:{x:{stacked:true}, y:{stacked:true}} }
  });

  function buildSellerProductDatasets(year){
    const prods = Object.keys(dataStore.products);
    const totals = prods.map(p => dataStore.products[p][year].reduce((a,b)=>a+b,0));
    const sellerTotals = dataStore.sellers[year];
    const sumSellers = sellerTotals.reduce((a,b)=>a+b,0);
    return prods.map((p,idx)=>({
      label: p,
      data: sellerTotals.map(sVal => Math.round(totals[idx]*(sVal/sumSellers))),
      backgroundColor: palette[idx % palette.length]
    }));
  }
  function updateSellerProdChart(year){
    sellerProdChart.data.datasets = buildSellerProductDatasets(year);
    sellerProdChart.update();
  }
  updateSellerProdChart(2020);

  // BOTÕES DE ANO
  document.querySelectorAll('.year-buttons').forEach(group=>{
    const target = group.dataset.target;
    group.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const year = Number(btn.dataset.year);
        group.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b===btn));

        if(target==='meta'){
          metaChart.data.datasets[0].data = dataStore.meta[year].meta;
          metaChart.data.datasets[1].data = dataStore.meta[year].receita;
          metaChart.update();
        } else if(target==='product'){
          productChart.data.datasets[0].data = dataStore.products[currentProduct][year];
          productChart.update();
        } else if(target==='seller'){
          sellerChart.data.datasets[0].data = dataStore.sellers[year];
          sellerChart.update();
        } else if(target==='sellerProd'){
          updateSellerProdChart(year);
        }
      });
    });
  });

  // BOTÕES DE PRODUTO
  document.querySelectorAll('.prod-filter').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.prod-filter').forEach(b=>b.classList.toggle('active', b===btn));
      currentProduct = btn.dataset.prod;

      const yearBtn = document.querySelector('.year-buttons[data-target="product"] button.active');
      const year = yearBtn ? Number(yearBtn.dataset.year) : 2020;

      productChart.data.datasets[0].label = currentProduct;
      productChart.data.datasets[0].data = dataStore.products[currentProduct][year];
      productChart.update();
    });
  });

});
