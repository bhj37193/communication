import { render, screen, waitFor } from '@testing-library/react-native';
import { ScoreCard } from '../components/ScoreCard';

// This RNTL version populates the `screen` singleton asynchronously, so content
// access goes through waitFor (mirrors screens.test.tsx).
describe('ScoreCard', () => {
  it('renders the score, verdict, and the positioning tagline', async () => {
    render(<ScoreCard score={87} passed />);

    await waitFor(() => expect(screen.getByText('87')).toBeTruthy());
    expect(screen.getByText('PASSED')).toBeTruthy();
    expect(
      screen.getByText(
        'The most interesting person in the room is the one who makes everyone else feel interesting.',
      ),
    ).toBeTruthy();
  });

  it('shows KEEP PRACTICING when not passed', async () => {
    render(<ScoreCard score={40} passed={false} />);
    await waitFor(() => expect(screen.getByText('KEEP PRACTICING')).toBeTruthy());
  });

  // The card's props are {score, passed} only — it structurally cannot render
  // win/fix/moment quote text. Confirm no transcript-shaped content leaks in.
  it('renders no transcript quote text', async () => {
    render(<ScoreCard score={87} passed />);
    await waitFor(() => expect(screen.getByText('87')).toBeTruthy());
    expect(screen.queryByText(/Quote:|Anchor:/)).toBeNull();
  });
});
