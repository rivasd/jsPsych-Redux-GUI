import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { timeline } from 'reducers';

// Archive the current state
// This action should be called by every other action before it
// calls it's reducer.
export const actionArchiveState = (store) => {
    var state = store.getState();
    if (state.pastStates.length >= 50) 
    {
        store.dispatch({
            type: 'ARCHIVE_STATE_REMOVE'
        })
    } 
    else 
    {
        store.dispatch({
            type: 'ARCHIVE_STATE'
        })
    }
}

// Restores the state from an past state
// archiving the current state as a future state
export const actionRestoreState = (store) => {
    var state = store.getState();
    if (state.futureStates.length >= 50) 
    {
        store.dispatch({
            type: 'RESTORE_STATE_REMOVE'
        })
    } 
    else if (state.pastStates.length > 0) 
    {
        store.dispatch({
            type: 'RESTORE_STATE'
        })
    }
    // Do nothing if there are no more states in the history
}

// Restore the state from a future state
export const actionRestoreFutureState = (store) => {
    var state = store.getState();

    if (state.futureStates.length > 0) 
    {
        store.dispatch({
            type: 'RESTORE_FUTURE_STATE'
        })
        // Do nothing if there are no more states in the history
    }
}


// Dispatch the action calling for a trial to be selected
export const actionToggleSelected = (store, trialID) => {
    actionArchiveState(store);
    //console.log("Select", store)
    var state = store.getState();

    if (state.trialTable[trialID].selected){
        store.dispatch({
            type: 'DESELECT_TRIAL',
            id: trialID
        })
        actionCloseDrawer(store);
    } else {
        store.dispatch({
            type: 'SELECT_TRIAL',
            id: trialID
        });
        actionOpenDrawer(store, trialID);
    }
}

// Dispatch the action calling for a new trial to be added
export const actionAddTrial = (store) => {
    actionArchiveState(store);
    //console.log ("Add", store)
    store.dispatch({
        type: 'ADD_TRIAL'
    });
}

// Dispatch action calling for a trial to be removed from trialList
export const actionRemoveTrial = (store) => {
    var state = store.getState();

    console.log("Archive State: ", state);
    actionArchiveState(store);

    //console.log("Remove", store)
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    });
}

// Dispatch an action calling for a Drawer to be opened
export const actionOpenDrawer = (store, id) => {
    store.dispatch({
        type: 'OPEN_DRAWER',
        id: id
    })
}
export const actionCloseDrawer = (store) => {
    store.dispatch({
        type:'CLOSE_DRAWER'
    });
}

// Move a trial from one position to another
export const actionMoveTrial = (store, fromPos, toPos) => {
    actionArchiveState(store);
    store.dispatch({
        type: 'MOVE_TRIAL',
        fromPos: fromPos,
        toPos: toPos
    });
}

export const actionChangeName = (store, trialName) => {
        store.dispatch({
        type: 'CHANGE_NAME',
        name: trialName
    })
        actionArchiveState(store);
}

export const actionToggleButton = (store, buttonVal) => {
    var state = store.getState();
    state.trialTable[state.openTrial].isTimeline = buttonVal;
    console.log(state.trialTable[state.openTrial].isTimeline);
    store.dispatch({
        type: 'TOGGLE_ISTIMELINE'
    })

}

