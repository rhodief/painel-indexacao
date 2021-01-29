import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit, OnDestroy {

  @ViewChild('thumbsView') private thumbsView: any
  globalInstance: any;
  totalPages: number;
  paginaAtual: number[];
  indices = exemploIndices;
  mapa: MapaInterface;


  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('entra aplicar')
      this.mapa = MapaTeste
      this.aplicarMapa(this.mapa);
      console.log('Fim aplicação')
    }, 3000)
  }

  ngOnDestroy(): void {
    this.globalInstance();
  }

  aoClicarNaPagina(pagina: number, element: HTMLDivElement, event: MouseEvent) {
    event.preventDefault();
    this.selecionarPaginasPeloClick(event, pagina)
    this.selecionarPaginas(this.paginaAtual)
  }

  selecionarPaginas(paginasSelecionadas: number[]) {
    setTimeout(() => {
      const paginas = this.getAllPages();
      paginas.forEach(element => {
        const estaSelecionado = paginasSelecionadas.indexOf(this.getPagina(element)) > -1;
        if (estaSelecionado) {
          this.marcarPagina(element)
        } else {
          this.desmarcarPagina(element);
        }
      });
    }, 1);
  }

  mostrarMapa() {
    console.log(this.mapa)
  }

  irParaIndice(item: ItemMapaInterface) {
    this.selecionarPaginas([item.inicio]);
    this.paginaAtual = [item.inicio];
    setTimeout(() => {
      const pages = this.getAllPages();
      const page = pages[item.inicio];
      page.scrollIntoView({ block: 'center',  behavior: 'smooth' });
    }, 13)

  }


  private editarMapa(indice: IndiceInterface): MapaInterface | false {
    if (!this.paginaAtual || this.paginaAtual.length < 1) {
      return false;
    }
    const inicio = this.paginaAtual[0];
    const fim = this.paginaAtual[this.paginaAtual.length -1]
    const novoMapa: MapaInterface = []
    this.mapa.forEach(mi => {
      const estaNoMesmoIntervalo = !((mi.inicio < inicio && mi.fim < inicio) || (mi.inicio > fim && mi.fim > fim))
      const novoIndice = this.indices.find(i => i.nomeIndice === mi.nomeIndice) ?? {nomeIndice: 'Não encontrado', color: 'red'}
      if (estaNoMesmoIntervalo) {
        if (mi.inicio < inicio && mi.fim <= fim) {
          novoMapa.push(this.getIndice(novoIndice, mi.inicio, inicio - 1))
        } else if (mi.inicio >= inicio && mi.fim <= fim) {
          // Caso em que um item está completamente dentro de outro... 
          //Estou considerando aqui que ele dirá desconsiderar a marcação anterior
        } else if(mi.inicio <= fim && mi.fim > fim) {
          //Caso que ele está com o início dentro e o fim fora
          novoMapa.push(this.getIndice(novoIndice, fim + 1, mi.fim))
        } else {
          //Case de está envolvendo a outra marcação, ela é desconsiderada
        }
      } else {
        novoMapa.push(mi)
      }
    });
    if (indice.nomeIndice !== 'Desmarcar') {
      novoMapa.push(this.getIndice(indice, inicio, fim))  
    }
    novoMapa.sort((a, b) => a.inicio > b.inicio ? 1 : -1)
    return novoMapa
  }

  selecaoIndice(indice: IndiceInterface) {
    if (this.paginaAtual && this.paginaAtual.length > 0) {
      const novoMapa = this.editarMapa(indice);
      if (novoMapa) {
        this.aplicarMapa(novoMapa)
      }
    }
  }

  getColor(nomeIndice: string) {
    const obj = this.indices.find(i => i.nomeIndice === nomeIndice)
    return obj?.color ?? 'red';
    
  }

  private getIndice(indice: IndiceInterface, inicio: number, fim: number) {
    return {
      color: indice.color,
      nomeIndice: indice.nomeIndice,
      inicio,
      fim
    }
  }

  private marcarPagina(el: HTMLDivElement) {
    this.renderer.addClass(el, 'pagina-ativada');
  }

  private desmarcarPagina(el: HTMLDivElement) {
    this.renderer.removeClass(el, 'pagina-ativada');
  }

  aposCompletarCarregamento(pdfData) {
    if (this.totalPages !== pdfData.numPages) {
      this.totalPages = pdfData.numPages;
    }
    this.agregarEventoClick();
  }

  paginaRenderizou($event) {
  }

  agregarEventoClick(): void {
    setTimeout(() => {
      const pages = this.getAllPages();
      pages.forEach(element => {
        this.renderer.listen(element, 'click', ($event) => {
          const p = this.getPagina(element);
          this.aoClicarNaPagina(p, element, $event)
        })
      });
    }, 500)
  }

  private aplicarMapa(mapa: MapaInterface) {
    this.mapa = mapa;
    this.limparEstilosIndices();
    mapa.forEach(e => this.aplicarEstiloIndice(e))
  }

  private aplicarEstiloIndice(item: ItemMapaInterface) {
    setTimeout(() => {
      const paginas = this.getAllPages()
      paginas.forEach((el, i) => {
        const pagina = i + 1;
        if (pagina === item.inicio) {
          this.renderer.setAttribute(el, 'data-indexacao', item.nomeIndice)
        } 
        if (pagina >= item.inicio && pagina <= item.fim) {
          this.renderer.addClass(el, 'pagina-marcada-indice')
          const color = this.indices.find((i) => i.nomeIndice === item.nomeIndice) ?? {color: 'red'};
          el.style.setProperty('--indexacao-color', color.color)
        } 
      });
    }, 11)
  }

  private limparEstilosIndices() {
    const paginas = this.getAllPages()
      paginas.forEach((el, i) => {
        this.renderer.removeAttribute(el, 'data-indexacao')
        this.renderer.removeClass(el, 'pagina-marcada-indice')
      });
  }

  private getPagina(el: HTMLDivElement): number {
    return parseInt(el.getAttribute('data-page-number'))
  }

  private getAllPages() {
    return this.thumbsView.element.nativeElement.querySelectorAll('.page');
  }

  private selecionarPaginasPeloClick(event: MouseEvent, pagina: number) {
    const individual = event.ctrlKey;
    const intervalo = event.shiftKey;
    if (individual && !intervalo) {
      const index = this.paginaAtual.indexOf(pagina);
      if (index > -1) {
        this.paginaAtual.splice(index, 1);
      } else {
        this.paginaAtual = [...this.paginaAtual, pagina];
      }
    } else if (intervalo && !individual) {
      const ini = this.paginaAtual[0] ?? 1;
      const fim = pagina;
      this.paginaAtual = Array.from({ length: fim - ini + 1 }, (v, k) => k + ini);
    } else {
      this.paginaAtual = [pagina];
    }
  }

}



export interface ItemMapaInterface {
  inicio: number;
  fim: number;
  nomeIndice: string;
}

export type MapaInterface = ItemMapaInterface[]


export const MapaTeste: MapaInterface = [
  {
    inicio: 1,
    fim: 4,
    nomeIndice: 'Folha de Rosto'
  },
  {
    inicio: 9,
    fim: 13,
    nomeIndice: 'Sumário'
  },
  {
    inicio: 15,
    fim: 28,
    nomeIndice: 'Inicial de H. Corpus'
  },
  {
    inicio: 32,
    fim: 67,
    nomeIndice: 'Decisão Trib. Origem'
  }
];

export const MapaTeste2: MapaInterface = [
  {
    inicio: 5,
    fim: 9,
    nomeIndice: 'Folha de Rosto'
  },
  {
    inicio: 12,
    fim: 18,
    nomeIndice: 'Sumário'
  },
  {
    inicio: 21,
    fim: 28,
    nomeIndice: 'Inicial de H. Corpus'
  },
  {
    inicio: 44,
    fim: 55,
    nomeIndice: 'Decisão Trib. Origem'
  }
]

interface IndiceInterface {
  nomeIndice: string;
  color: string;
}

const exemploIndices: IndiceInterface[] = [
  {nomeIndice: 'Desmarcar', color: ''},
  {nomeIndice: 'Folha de Rosto',color: '#63a973'},
  {nomeIndice: 'Sumário',color: '#648cb5'},
  {nomeIndice: 'Inicial de H. Corpus',color: '#738f94'},
  {nomeIndice: 'Decisão Trib. Origem', color: '#9c8e60'},
  {nomeIndice: 'Homol Prisão', color: '#1A6A80'},
  {nomeIndice: 'Sentença', color: '#0DAB98'},
  {nomeIndice: 'Def/Indef Revog Prisão', color: '#5A72A5'},
  {nomeIndice: 'Antecedentes Criminais', color: '#C97297'},
  {nomeIndice: 'Guia de Execução', color: '#F69333'},
  {nomeIndice: 'a', color: '#334A52'},
  {nomeIndice: 'b', color: '#308878'},
  {nomeIndice: 'c', color: '#7F508B'}
]



