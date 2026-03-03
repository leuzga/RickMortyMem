import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout Component', () => {
  it('debe renderizar el título por defecto', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const title = screen.getByText('Hello, welcome!');
    expect(title).toBeDefined();
  });

  it('debe renderizar título personalizado', () => {
    render(
      <AuthLayout title="Custom Title">
        <div>Test Content</div>
      </AuthLayout>
    );

    const title = screen.getByText('Custom Title');
    expect(title).toBeDefined();
  });

  it('debe renderizar children', () => {
    render(
      <AuthLayout>
        <div data-testid="test-content">Test Content</div>
      </AuthLayout>
    );

    const content = screen.getByTestId('test-content');
    expect(content).toBeDefined();
  });

  it('debe mostrar el logo', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const logo = screen.getByAltText('Memory Game Logo');
    expect(logo).toBeDefined();
  });


  it('debe mostrar el título Memory Game', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const gameTitle = screen.getByText('Memory Game');
    expect(gameTitle).toBeDefined();
  });

  it('debe mostrar el subtítulo Rick and Morty Edition', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const subtitle = screen.getByText('Rick and Morty Edition');
    expect(subtitle).toBeDefined();
  });
});
