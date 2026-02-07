/**
 * Interfaz genérica para todas las respuestas de la API
 * @template T - Tipo de datos que contiene la respuesta
 */
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

/**
 * Tipo para respuestas sin data (data: null)
 */
export type ApiResponseNoData = ApiResponse<null>;

/**
 * Tipo para respuestas con data vacía (data: {})
 */
export type ApiResponseEmpty = ApiResponse<Record<string, never>>;
