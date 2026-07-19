import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

// Router + api are mocked so we can render each screen in isolation and assert
// its primary action fires the right api call. This RNTL version populates the
// `screen` singleton asynchronously, so first content access uses findBy*.
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('../lib/api', () => ({
  ApiError: class ApiError extends Error {},
  createSession: jest.fn(),
  sendMessage: jest.fn(),
  endSession: jest.fn(),
  getResult: jest.fn(),
}));

let mockParams: Record<string, string> = {};

import EntryScreen from '../app/index';
import ChatScreen from '../app/chat';
import ResultScreen from '../app/result';
import { createSession, endSession, getResult, sendMessage } from '../lib/api';

beforeEach(() => {
  mockPush.mockReset();
  mockReplace.mockReset();
  (createSession as jest.Mock).mockReset();
  (sendMessage as jest.Mock).mockReset();
  (endSession as jest.Mock).mockReset();
  (getResult as jest.Mock).mockReset();
  mockParams = {};
});

describe('EntryScreen', () => {
  it('renders the scenario and Start creates a session then navigates', async () => {
    (createSession as jest.Mock).mockResolvedValue({
      session_id: 's1',
      opener: 'Hey.',
      remaining: 10,
    });
    render(<EntryScreen />);
    await waitFor(() => expect(screen.getByText('The Housewarming')).toBeTruthy());

    fireEvent.press(screen.getByText('Start'));

    await waitFor(() => expect(createSession).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/chat',
          params: expect.objectContaining({ id: 's1', opener: 'Hey.' }),
        }),
      ),
    );
  });
});

describe('ChatScreen', () => {
  it('renders opener + remaining and Send posts the message', async () => {
    mockParams = { id: 's1', opener: 'Hey. Nice place.', remaining: '10' };
    (sendMessage as jest.Mock).mockResolvedValue({ reply: 'Oh nice', warmth: 2, remaining: 9 });

    render(<ChatScreen />);
    await waitFor(() => expect(screen.getByText('Hey. Nice place.')).toBeTruthy());
    expect(screen.getByText('10 messages left')).toBeTruthy();

    fireEvent.changeText(screen.getByLabelText('message input'), 'so what do you do?');
    // Wait for the input value to reflect state so the Send button is enabled.
    await waitFor(() =>
      expect(screen.getByLabelText('message input').props.value).toBe('so what do you do?'),
    );
    fireEvent.press(screen.getByText('Send'));

    await waitFor(() => expect(sendMessage).toHaveBeenCalledWith('s1', 'so what do you do?'));
    // Reply is revealed after the randomized typing delay (<=1800ms).
    await waitFor(() => expect(screen.getByText('Oh nice')).toBeTruthy(), { timeout: 3000 });
  });

  it('"I\'m done" ends the session and navigates to result', async () => {
    mockParams = { id: 's1', opener: 'Hey.', remaining: '10' };
    (endSession as jest.Mock).mockResolvedValue({ session_id: 's1', status: 'scored' });

    render(<ChatScreen />);
    await waitFor(() => expect(screen.getByText("I'm done")).toBeTruthy());
    fireEvent.press(screen.getByText("I'm done"));

    await waitFor(() => expect(endSession).toHaveBeenCalledWith('s1'));
    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: '/result', params: { id: 's1' } }),
      ),
    );
  });
});

describe('ResultScreen', () => {
  it('polls the result and renders WIN / FIX / THE MOMENT / SCORE', async () => {
    mockParams = { id: 's1' };
    (getResult as jest.Mock).mockResolvedValue({
      status: 'scored',
      result: {
        score: 100,
        passed: true,
        win: { text: 'Great open question', quote: 'What brings you here?' },
        fix: { text: 'Follow up sooner', anchor: 'message 3' },
        moment: { text: 'Sam opened up', quote: 'Actually, yeah' },
        signals: {},
        template_fallback: false,
      },
    });

    render(<ResultScreen />);

    await waitFor(() => expect(getResult).toHaveBeenCalledWith('s1'));
    await waitFor(() => expect(screen.getByText('100')).toBeTruthy());
    expect(screen.getByText('WIN')).toBeTruthy();
    expect(screen.getByText('FIX')).toBeTruthy();
    expect(screen.getByText('THE MOMENT')).toBeTruthy();
  });

  it('shows a loading state while the result is still scoring (202)', async () => {
    mockParams = { id: 's1' };
    (getResult as jest.Mock).mockResolvedValue({ status: 'pending', state: 'scoring' });

    render(<ResultScreen />);
    await waitFor(() => expect(screen.getByTestId('result-loading')).toBeTruthy());
    await waitFor(() => expect(getResult).toHaveBeenCalled());
  });
});
