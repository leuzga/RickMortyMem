import { describe, it, expect, beforeEach } from 'vitest';
import { useToastStore, generateId } from './useToastStore';

// Reset Zustand store between tests
const resetStore = () => useToastStore.setState({ toasts: [] });

// ─── generateId ───────────────────────────────────────────────────────────────

describe('generateId', () => {
  it('debe retornar un string no vacío', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('debe generar IDs únicos en llamadas consecutivas', () => {
    const ids = Array.from({ length: 20 }, generateId);
    const unique = new Set(ids);
    expect(unique.size).toBe(20);
  });
});

// ─── useToastStore ────────────────────────────────────────────────────────────

describe('useToastStore — showToast', () => {
  beforeEach(resetStore);

  it('debe agregar un toast con el mensaje y tipo correctos', () => {
    useToastStore.getState().showToast('Hola', 'success');
    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.message).toBe('Hola');
    expect(toasts[0]?.type).toBe('success');
  });

  it('debe usar tipo "info" por defecto', () => {
    useToastStore.getState().showToast('Mensaje');
    const { toasts } = useToastStore.getState();
    expect(toasts[0]?.type).toBe('info');
  });

  it('debe asignar duration 3000 por defecto', () => {
    useToastStore.getState().showToast('Mensaje');
    expect(useToastStore.getState().toasts[0]?.duration).toBe(3000);
  });

  it('debe respetar una duration personalizada', () => {
    useToastStore.getState().showToast('Mensaje', 'error', 5000);
    expect(useToastStore.getState().toasts[0]?.duration).toBe(5000);
  });

  it('debe asignar un id único a cada toast', () => {
    useToastStore.getState().showToast('A');
    useToastStore.getState().showToast('B');
    const { toasts } = useToastStore.getState();
    expect(toasts[0]?.id).not.toBe(toasts[1]?.id);
  });

  it('debe acumular múltiples toasts', () => {
    useToastStore.getState().showToast('Uno');
    useToastStore.getState().showToast('Dos');
    useToastStore.getState().showToast('Tres');
    expect(useToastStore.getState().toasts).toHaveLength(3);
  });
});

describe('useToastStore — removeToast', () => {
  beforeEach(resetStore);

  it('debe eliminar el toast con el ID especificado', () => {
    useToastStore.getState().showToast('Mensaje');
    const id = useToastStore.getState().toasts[0]!.id;
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('no debe eliminar otros toasts al remover uno', () => {
    useToastStore.getState().showToast('A');
    useToastStore.getState().showToast('B');
    const firstId = useToastStore.getState().toasts[0]!.id;
    useToastStore.getState().removeToast(firstId);
    const remaining = useToastStore.getState().toasts;
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.message).toBe('B');
  });

  it('no debe lanzar error al remover un ID inexistente', () => {
    expect(() => useToastStore.getState().removeToast('id-inexistente')).not.toThrow();
  });
});

describe('useToastStore — clearAllToasts', () => {
  beforeEach(resetStore);

  it('debe limpiar todos los toasts', () => {
    useToastStore.getState().showToast('A');
    useToastStore.getState().showToast('B');
    useToastStore.getState().clearAllToasts();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('no debe lanzar error si ya está vacío', () => {
    expect(() => useToastStore.getState().clearAllToasts()).not.toThrow();
  });
});
