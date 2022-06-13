export default {};
import { appReducer, RequestStatusType, setAppErrorAC, setAppStatusAC } from './app-reducer';

let startState: { status: RequestStatusType; error: string | null; isInitialized: boolean; } | undefined;

beforeEach( () => {
  startState = {
    error: null,
    status: 'idle',
    isInitialized: false,
  };
} );

test( 'correct error message should be set', () => {

  const endState = appReducer( startState, setAppErrorAC( { error: 'some error' } ) );

  expect( endState.error ).toBe( 'some error' );
} );

test( 'correct status should be set', () => {

  const endState = appReducer( startState, setAppStatusAC( { status: 'loading' } ) );

  expect( endState.status ).toBe( 'loading' );
} );

