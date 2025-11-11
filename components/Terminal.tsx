"use client"

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Command {
  name: string;
  description: string;
  output: string[];
  icon?: string;
}

interface TerminalProps {
  commands: Command[];
  prompt?: string;
  initialMessage?: string;
  onExit?: () => void;
}

export default function Terminal({ 
  commands, 
  prompt = "anish@whoami:~$",
  initialMessage = "Type 'help' to see available commands.",
  onExit
}: TerminalProps) {
  const [currentCommand, setCurrentCommand] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<Array<{ command: string; output: string[] }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [displayedOutput, setDisplayedOutput] = useState<string>('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCommand = (cmd: string) => {
    const command = commands.find(c => c.name === cmd.toLowerCase());
    const cmdLower = cmd.toLowerCase();
    
    if (cmdLower === 'help') {
      const helpOutput = [
        '',
        'available commands:',
        ...commands.map(c => `  • ${c.name.padEnd(12)} — ${c.description}`),
        '',
        'Type a command above or click one.',
        'Type "exit" or "back" to return to menu.'
      ];
      setCommandHistory(prev => [...prev, { command: cmd, output: helpOutput }]);
      setCurrentCommand(null);
      setInputValue('');
      return;
    }

    if (cmdLower === 'clear') {
      setCommandHistory([]);
      setCurrentCommand(null);
      setInputValue('');
      setDisplayedOutput('');
      setIsTyping(false);
      // Clear any pending typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      return;
    }

    if (cmdLower === 'exit' || cmdLower === 'back') {
      if (onExit) {
        onExit();
      } else {
        const exitOutput = [
          '',
          'Use the Back button in the top right to return to the menu.',
          'Or press Escape key to go back.',
          ''
        ];
        setCommandHistory(prev => [...prev, { command: cmd, output: exitOutput }]);
        setInputValue('');
      }
      return;
    }

    if (command) {
      // Clear any existing typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setCurrentCommand(command.name);
      // Add command to history with empty output initially
      const historyEntry = { command: cmd, output: [] };
      setCommandHistory(prev => [...prev, historyEntry]);
      setInputValue('');
      setIsTyping(true);
      setDisplayedOutput('');
      setCurrentLineIndex(0);
      // Start typing with a small delay to ensure state is updated
      setTimeout(() => {
        typeOutput(command.output, 0);
      }, 150);
    } else {
      const errorOutput = [
        '',
        `command not found: ${cmd}`,
        'Type "help" for available commands.',
        ''
      ];
      setCommandHistory(prev => [...prev, { command: cmd, output: errorOutput }]);
      setInputValue('');
    }
  };

  const typeOutput = (output: string[], lineIdx: number) => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (lineIdx >= output.length) {
      // Typing complete - update command history with full output
      setCommandHistory(prev => {
        if (prev.length === 0) return prev;
        const newHistory = [...prev];
        const lastEntry = { ...newHistory[newHistory.length - 1] };
        lastEntry.output = [...output]; // Create new array to ensure React detects change
        newHistory[newHistory.length - 1] = lastEntry;
        return newHistory;
      });
      // Clear typing state after ensuring history is updated
      setTimeout(() => {
        setIsTyping(false);
        setCurrentLineIndex(0);
        setDisplayedOutput('');
        setCurrentCommand(null);
      }, 50);
      return;
    }

    const currentLine = output[lineIdx];
    setCurrentLineIndex(lineIdx);
    
    // Handle empty lines
    if (currentLine === '') {
      setDisplayedOutput(prev => {
        const lines = prev.split('\n');
        // Add empty line if not already there
        if (lines.length <= lineIdx || lines[lineIdx] !== '') {
          while (lines.length <= lineIdx) {
            lines.push('');
          }
          lines[lineIdx] = '';
        }
        return lines.join('\n');
      });
      typingTimeoutRef.current = setTimeout(() => typeOutput(output, lineIdx + 1), 30);
      return;
    }

    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < currentLine.length) {
        setDisplayedOutput(prev => {
          const lines = prev.split('\n');
          // Ensure we have enough lines
          while (lines.length <= lineIdx) {
            lines.push('');
          }
          lines[lineIdx] = currentLine.substring(0, charIndex + 1);
          return lines.join('\n');
        });
        charIndex++;
        typingTimeoutRef.current = setTimeout(typeChar, 15); // Typing speed
      } else {
        // Line complete, add newline and move to next
        setDisplayedOutput(prev => {
          const lines = prev.split('\n');
          while (lines.length <= lineIdx) {
            lines.push('');
          }
          lines[lineIdx] = currentLine;
          return lines.join('\n') + '\n';
        });
        typingTimeoutRef.current = setTimeout(() => typeOutput(output, lineIdx + 1), 50);
      }
    };

    typeChar();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      handleCommand(inputValue.trim());
    }
  };

  const handleCommandClick = (cmdName: string) => {
    if (!isTyping) {
      setInputValue(cmdName);
      handleCommand(cmdName);
    }
  };

  useEffect(() => {
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  }, [isTyping, commandHistory]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, displayedOutput]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle Escape key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isTyping && onExit) {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTyping, onExit]);

  return (
    <div className="terminal-container">
      <div ref={terminalRef} className="terminal">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-btn terminal-btn-close"></span>
            <span className="terminal-btn terminal-btn-minimize"></span>
            <span className="terminal-btn terminal-btn-maximize"></span>
          </div>
          <div className="terminal-title">anish@whoami: ~</div>
        </div>
        
        <div className="terminal-body">
          {commandHistory.length === 0 && (
            <div className="terminal-line">
              <span className="terminal-prompt">{prompt}</span>
              <span className="terminal-text">{initialMessage}</span>
            </div>
          )}

          {commandHistory.map((item, idx) => (
            <div key={idx} className="terminal-output-block">
              <div className="terminal-line">
                <span className="terminal-prompt">{prompt}</span>
                <span className="terminal-command">{item.command}</span>
              </div>
              {item.output.length > 0 ? (
                <div className="terminal-output">
                  {item.output.map((line, lineIdx) => (
                    <div key={lineIdx} className="terminal-line">
                      <span className="terminal-text">{line === '' ? '\u00A0' : line}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {isTyping && currentCommand && (
            <div className="terminal-output-block">
              <div className="terminal-line">
                <span className="terminal-prompt">{prompt}</span>
                <span className="terminal-command">{currentCommand}</span>
              </div>
              <div className="terminal-output">
                {displayedOutput ? (
                  displayedOutput.split('\n').map((line, idx, arr) => {
                    const isLastLine = idx === arr.length - 1;
                    return (
                      <div key={idx} className="terminal-line">
                        <span className="terminal-text">{line}</span>
                        {isLastLine && isTyping && (
                          <span className="terminal-cursor">▋</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="terminal-line">
                    <span className="terminal-cursor">▋</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="terminal-prompt">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="terminal-input"
              disabled={isTyping}
              autoFocus
            />
            {!isTyping && <span className="terminal-cursor-blink">▋</span>}
          </form>

          {commandHistory.length === 0 && (
            <div className="terminal-help-hint">
              <div className="terminal-line">
                <span className="terminal-text">Try: </span>
                {commands.map((cmd, idx) => (
                  <span key={cmd.name}>
                    <button
                      onClick={() => handleCommandClick(cmd.name)}
                      className="terminal-command-link"
                    >
                      {cmd.name}
                    </button>
                    {idx < commands.length - 1 && <span className="terminal-text">, </span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

