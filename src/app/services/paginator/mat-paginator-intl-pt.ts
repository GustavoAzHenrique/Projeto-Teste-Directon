import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorIntlPt extends MatPaginatorIntl {
  // Rótulos personalizados para o paginador
  override itemsPerPageLabel = 'Itens por página:';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';
  ofLabel = 'de';

  // Método para calcular o rótulo do intervalo de páginas
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`;
    }
    const totalPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} ${this.ofLabel} ${totalPages}`;
  };
}
