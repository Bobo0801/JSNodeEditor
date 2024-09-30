

const actions= {
  MOVE: 'move',
  CONNECT: 'connect',
  COPY: 'copy',
  // RESIZE: 'resize',
  // DELETE: 'delete',
  // ADD: 'add',
  // DISCONNECT: 'disconnect',
  // SELECT: 'select',
  // DESELECT: 'deselect',
};





class Operation {
  action;
  sourceId;
  targetId;
  constructor(action, sourceId, targetId) {
    this.action = action;
    this.sourceId = sourceId;
    this.targetId = targetId;
  }
}


export { Operation, actions };