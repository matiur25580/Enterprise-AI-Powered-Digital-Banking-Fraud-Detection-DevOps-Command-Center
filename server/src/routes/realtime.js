module.exports = function registerRealtime(io) {
  io.on('connection', (socket) => {
    // No synthetic financial events are emitted. Real-time streams must be
    // backed by authorized, persisted events before being exposed to clients.
    socket.emit('connection:ready', { authenticated: true, role: socket.user.role });
  });
};
