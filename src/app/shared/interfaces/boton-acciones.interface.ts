export interface BotonAcciones {
  icono: string;
  color: string;
  tooltip?: string;
  disabled?: boolean;
  eventoClick: (event: Event) => void;
}
