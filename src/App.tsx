import { useState, useEffect, useCallback } from 'react';
import { Copy, Loader2, ExternalLink } from 'lucide-react';

// Tipo para as notificações de saque
type WithdrawalNotification = {
  id: number;
  name: string;
  amount: string;
  visible: boolean;
};

// Componente de notificação de saque
const WithdrawalNotificationItem = ({ name, amount }: { name: string; amount: string }) => {
  return (
    <div className="flex items-center gap-2 bg-[#080619]/90 border border-[#5010FF]/30 rounded-md p-2 text-xs shadow-md animate-slideInRight">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" className="flex-shrink-0">
        <path fill="#4db6ac" d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76 l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"></path>
        <path fill="#4db6ac" d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76 l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"></path>
        <path fill="#4db6ac" d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0 l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17 l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26 C46.65,21.88,46.65,26.12,44.04,28.74z"></path>
      </svg>
      <span className="text-white">
        <span className="text-[#5010FF] font-medium">{name}</span> sacou <span className="text-[#5010FF] font-medium">{amount}</span>
      </span>
    </div>
  );
};

// Componente para o fundo com tema de opções binárias
const MatrixBackground = () => {
  // Estilo para garantir que o canvas cubra toda a tela, incluindo a área da barra de status no iOS
  const canvasStyle = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    paddingTop: 'env(safe-area-inset-top, 0)',
    backgroundColor: '#080619',
  };
  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Configurações para o grid de fundo
    const gridSize = 30;
    const gridOpacity = 0.1;

    // Configurações para os padrões de velas (candlesticks)
    const candlePatterns: { x: number; y: number; width: number; height: number; type: 'up' | 'down'; opacity: number; speed: number }[] = [];
    const patternCount = 15; // Número de padrões de velas

    // Configurações para os números binários (0s e 1s)
    const binaryDigits: { x: number; y: number; value: string; size: number; opacity: number; speed: number }[] = [];
    const digitCount = 50; // Número de dígitos binários

    // Cores para os candles
    const upColor = '#00ff4c'; // Verde para alta
    const downColor = '#ff3c3c'; // Vermelho para baixa

    // Inicializar padrões de velas
    for (let i = 0; i < patternCount; i++) {
      const candleWidth = Math.random() * 20 + 5;
      const candleHeight = Math.random() * 60 + 20;
      candlePatterns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: candleWidth,
        height: candleHeight,
        type: Math.random() > 0.5 ? 'up' : 'down',
        opacity: Math.random() * 0.3 + 0.05,
        speed: Math.random() * 0.5 + 0.2
      });
    }

    // Inicializar dígitos binários
    for (let i = 0; i < digitCount; i++) {
      binaryDigits.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        value: Math.random() > 0.5 ? '1' : '0',
        size: Math.random() * 16 + 8,
        opacity: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 1 + 0.5
      });
    }

    // Função para desenhar o grid
    const drawGrid = () => {
      context.strokeStyle = 'rgba(80, 16, 255, ' + gridOpacity + ')';
      context.lineWidth = 0.5;

      // Linhas horizontais
      for (let y = 0; y < canvas.height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
      }

      // Linhas verticais
      for (let x = 0; x < canvas.width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
      }
    };

    // Função para desenhar padrões de velas
    const drawCandlePatterns = () => {
      candlePatterns.forEach(candle => {
        // Desenhar o corpo da vela
        context.fillStyle = candle.type === 'up' ?
          `rgba(0, 255, 76, ${candle.opacity})` :
          `rgba(255, 60, 60, ${candle.opacity})`;

        context.fillRect(
          candle.x,
          candle.y,
          candle.width,
          candle.height
        );

        // Desenhar as sombras (linhas acima e abaixo)
        context.beginPath();
        context.moveTo(candle.x + candle.width / 2, candle.y - candle.height * 0.3);
        context.lineTo(candle.x + candle.width / 2, candle.y + candle.height * 1.3);
        context.strokeStyle = candle.type === 'up' ?
          `rgba(0, 255, 76, ${candle.opacity * 0.7})` :
          `rgba(255, 60, 60, ${candle.opacity * 0.7})`;
        context.lineWidth = 1;
        context.stroke();

        // Mover velas para baixo
        candle.y += candle.speed;

        // Reposicionar velas que saíram da tela
        if (candle.y > canvas.height + candle.height) {
          candle.y = -candle.height;
          candle.x = Math.random() * canvas.width;
          candle.type = Math.random() > 0.5 ? 'up' : 'down';
          candle.opacity = Math.random() * 0.3 + 0.05;
        }
      });
    };

    // Função para desenhar dígitos binários
    const drawBinaryDigits = () => {
      binaryDigits.forEach(digit => {
        context.font = `${digit.size}px monospace`;
        context.fillStyle = digit.value === '1' ?
          `rgba(0, 255, 76, ${digit.opacity})` :
          `rgba(255, 60, 60, ${digit.opacity})`;
        context.fillText(digit.value, digit.x, digit.y);

        // Mover dígitos para baixo
        digit.y += digit.speed;

        // Reposicionar dígitos que saíram da tela
        if (digit.y > canvas.height) {
          digit.y = -digit.size;
          digit.x = Math.random() * canvas.width;
          digit.value = Math.random() > 0.5 ? '1' : '0';
          digit.opacity = Math.random() * 0.4 + 0.1;
        }

        // Chance de mudar o valor (0 para 1 ou vice-versa)
        if (Math.random() < 0.005) {
          digit.value = digit.value === '1' ? '0' : '1';
        }
      });
    };

    // Função para desenhar linhas de gráfico
    const drawChartLines = () => {
      // Linha de gráfico verde (alta)
      context.beginPath();
      context.moveTo(0, canvas.height * 0.3 + Math.sin(Date.now() * 0.001) * 50);

      for (let x = 0; x < canvas.width; x += 20) {
        const y = canvas.height * 0.3 + Math.sin((Date.now() + x) * 0.001) * 50;
        context.lineTo(x, y);
      }

      context.strokeStyle = `rgba(0, 255, 76, 0.2)`;
      context.lineWidth = 2;
      context.stroke();

      // Linha de gráfico vermelha (baixa)
      context.beginPath();
      context.moveTo(0, canvas.height * 0.7 + Math.cos(Date.now() * 0.001) * 50);

      for (let x = 0; x < canvas.width; x += 20) {
        const y = canvas.height * 0.7 + Math.cos((Date.now() + x) * 0.001) * 50;
        context.lineTo(x, y);
      }

      context.strokeStyle = `rgba(255, 60, 60, 0.2)`;
      context.lineWidth = 2;
      context.stroke();
    };

    // Função principal de animação
    const draw = () => {
      // Limpar canvas com fundo semi-transparente para criar efeito de rastro
      context.fillStyle = 'rgba(8, 6, 25, 0.3)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar elementos
      drawGrid();
      drawChartLines();
      drawCandlePatterns();
      drawBinaryDigits();
    };

    const animationInterval = setInterval(draw, 30);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(animationInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      id="matrix-canvas"
      style={canvasStyle}
      className="opacity-80"
    />
  );
};

// Lista de nomes brasileiros para as notificações
const brazilianNames = [
  "Miguel", "Arthur", "Gael", "Theo", "Heitor", "Ravi", "Davi", "Bernardo", "Noah", "Gabriel",
  "Samuel", "Pedro", "Anthony", "Isaac", "Benicio", "Benjamin", "Matheus", "Lucas", "Joaquim", "Nicolas",
  "Lucca", "Lorenzo", "Henrique", "João", "Rafael", "Henry", "Murilo", "Levi", "Guilherme", "Vicente",
  "Felipe", "Bryan", "Matteo", "Bento", "Antônio", "Enzo", "Daniel", "Anthony", "Leonardo", "Davi Lucca",
  "Bryan", "Eduardo", "Gael", "Ryan", "Vitor", "Cauã", "Antônio", "Caleb", "Gustavo", "Yuri",
  "Sophia", "Helena", "Valentina", "Alice", "Laura", "Maria Alice", "Maitê", "Liz", "Cecilia", "Isabella",
  "Luisa", "Eloah", "Heloisa", "Julia", "Lara", "Maria Luiza", "Mariana", "Olivía", "Ayla", "Yasmin",
  "Isis", "Maria Julia", "Elisa", "Antonella", "Rafaela", "Maria Clara", "Agatha", "Lorena", "Livia", "Clara",
  "Maria Cecilia", "Maria Eduarda", "Marina", "Beatriz", "Melissa", "Ravi", "Luana", "Ana Laura", "Catarina", "Malu",
  "Mirella", "Ana Luiza", "Isabel", "Alicia", "Carolina", "Milena", "Gabriela", "Rebeca", "Manuela", "Ana Clara",
  "Larissa", "Stella", "Camila", "Amanda", "Leticia", "Lara", "Giovanna", "Fernanda", "Bruna", "Vitoria"
];

// Função removida: detecção de dispositivos iOS

function App() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(true);
  const [displayedCode, setDisplayedCode] = useState<string>("");
  const [codeTypingEffect, setCodeTypingEffect] = useState<boolean>(false);
  const [codeShufflingEffect, setCodeShufflingEffect] = useState<boolean>(false);
  const [shuffleColor, setShuffleColor] = useState<string>("text-yellow-400");
  const [codeGenerated, setCodeGenerated] = useState<boolean>(false);
  const [showIframe, setShowIframe] = useState<boolean>(false);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [codeGeneratedTime, setCodeGeneratedTime] = useState<number | null>(null);
  // Estado de detecção de iOS removido
  const [chartPosition, setChartPosition] = useState<number>(0);
  const [canGenerateNewCode, setCanGenerateNewCode] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [notifications, setNotifications] = useState<WithdrawalNotification[]>([]);

  // Função para criar um caractere aleatório
  const getRandomChar = () => {
    // Adicionando mais caracteres especiais para tornar a animação mais interessante
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*!?+=';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Função para obter uma cor aleatória para os caracteres durante o embaralhamento
  const getRandomColor = () => {
    const colors = ['text-[#5010FF]', 'text-[#6020FF]', 'text-[#4010DD]', 'text-[#7030FF]', 'text-[#3010BB]'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Função para gerar o código fixo V404F
  const generateRandomCode = () => {
    // Retorna sempre o código fixo V404F
    return "V404F";
  };

  // Função para simular efeito de embaralhamento para o código de segurança
  const simulateCodeShuffling = () => {
    setCodeShufflingEffect(true);
    setCodeGenerated(false);
    let iterations = 0;
    const maxIterations = 25; // Reduzido para tornar a animação mais rápida
    const shuffleInterval = setInterval(() => {
      // Criar uma string embaralhada aleatória
      const shuffledText = Array.from({ length: 5 }, () => {
        return getRandomChar();
      }).join('');

      // Atualizar a cor aleatoriamente para criar um efeito visual mais interessante
      setShuffleColor(getRandomColor());
      setDisplayedCode(shuffledText);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(shuffleInterval);
        setCodeShufflingEffect(false);
        simulateCodeTyping(generateRandomCode());
      }
    }, 50); // Reduzido para tornar a animação mais rápida
  };

  // Função para simular efeito de digitação para o código de segurança
  const simulateCodeTyping = (finalCode: string) => {
    setCodeTypingEffect(true);
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < finalCode.length) {
        setDisplayedCode(finalCode.substring(0, i + 1));
        i++;
      } else {
        // Adiciona um atraso antes de finalizar a animação
        setTimeout(() => {
          clearInterval(typeInterval);
          setCodeTypingEffect(false);
          setCodeGenerated(true); // Marca o código como gerado com sucesso
          setShowButton(true); // Reexibe o botão após a digitação completar

          // Salvar o código no localStorage com tempo de expiração (1 hora)
          const currentTime = new Date().getTime();
          const expiryTime = currentTime + 3600000; // 1 hora em milissegundos

          const codeData = {
            code: finalCode,
            generatedTime: currentTime,
            expiryTime: expiryTime
          };

          localStorage.setItem('cyberCodeData', JSON.stringify(codeData));
          setCodeGeneratedTime(currentTime);
          setCanGenerateNewCode(false);
          updateTimeRemaining(expiryTime);

        }, 500); // Mantém o código visível por meio segundo antes de finalizar
        clearInterval(typeInterval); // Evita que o intervalo continue rodando
      }
    }, 200); // Velocidade da digitação
  };

  // Função para lidar com o clique no botão gerar
  const handleGenerateClick = () => {
    // Verificar se pode gerar um novo código
    if (!canGenerateNewCode) {
      return;
    }

    setIsGenerating(true);
    setDisplayedCode("");
    setShowButton(false); // Esconde o botão ao iniciar a geração
    setShowIframe(false); // Esconde o iframe ao gerar novo código
    setCodeGenerated(false); // Reseta o estado de código gerado
    setCodeCopied(false); // Reseta o estado de código copiado

    // Inicia a animação imediatamente sem delay
    simulateCodeShuffling();
    setIsGenerating(false);
  };

  // Função para copiar o código para a área de transferência
  const handleCopyClick = () => {
    if (!displayedCode) return;

    // Primeiro, garantir que o estado esteja resetado
    setCodeCopied(false);

    // Usar setTimeout para garantir que o React atualize o estado antes de definir como true
    setTimeout(() => {
      // Mostrar a mensagem de confirmação imediatamente para feedback visual rápido
      setCodeCopied(true);

      // Tentar copiar o código
      navigator.clipboard.writeText(displayedCode)
        .then(() => {
          console.log("Código copiado com sucesso!");
        })
        .catch(err => {
          // Fallback para iOS e outros dispositivos que podem ter problemas com a API clipboard
          console.error('Erro ao copiar: ', err);

          // Criar um elemento temporário para copiar o texto (método alternativo)
          try {
            const textArea = document.createElement('textarea');
            textArea.value = displayedCode;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          } catch (e) {
            console.error('Erro no método alternativo de cópia:', e);
          }
        });

      // Esconder a mensagem após 3 segundos, independentemente do resultado da cópia
      setTimeout(() => {
        setCodeCopied(false);
      }, 3000);
    }, 10);
  };

  // Função para lidar com o clique no botão acessar corretora
  const handleBrokerClick = () => {
    setShowIframe(!showIframe); // Alterna a exibição do iframe
    playClickSound();

    // Prevenir que a página role para o topo quando o iframe é exibido
    if (!showIframe) {
      // Adiciona um evento para prevenir o comportamento padrão de rolagem
      setTimeout(() => {
        const iframeContainer = document.querySelector('.iframe-container');
        if (iframeContainer) {
          iframeContainer.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        }
      }, 500);
    }
  };

  // Função para atualizar o iframe
  const handleRefreshIframe = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      // Reproduzir som de clique
      playClickSound();

      // Mostrar feedback visual
      const button = document.querySelector('button.text-\\[\\#00c3ff\\]');
      if (button) {
        button.textContent = 'ATUALIZANDO...';
        button.classList.add('animate-pulse');
      }

      // Método simples e direto: recarregar o iframe
      try {
        // Primeiro, tenta usar o método contentWindow.location.reload()
        if (iframe.contentWindow) {
          iframe.contentWindow.location.reload();
        }
      } catch (error) {
        // Se falhar devido a restrições de segurança, usa o método alternativo
        // Armazenar a URL atual
        const currentSrc = iframe.src;

        // Definir um src temporário e depois restaurar para forçar a atualização
        iframe.src = 'about:blank';

        // Usar setTimeout para garantir que o iframe seja limpo antes de recarregar
        setTimeout(() => {
          iframe.src = currentSrc;
        }, 50);
      }

      // Restaurar o texto do botão após um tempo
      setTimeout(() => {
        if (button) {
          button.textContent = 'ATUALIZAR';
          button.classList.remove('animate-pulse');
        }
      }, 1500);
    }
  };

  // Efeito sonoro para cliques
  const playClickSound = () => {
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAADQAAoKCgoKCgoKCgoKCg+Pj4+Pj4+Pj4+Pj4+PmRkZGRkZGRkZGRkZGRkeHh4eHh4eHh4eHh4eHiOjo6Ojo6Ojo6Ojo6OjqSkpKSkpKSkpKSkpKSk//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUHQ//7UMQAAAqsITe0EQAh2wml7IggBExccXcDgcA4HA4gQEBAQO4fB+H8Pn/o/D4fwfh8/9H4fB+D8Pn/o/D4fwfh8/9AgICAgIHcDgcDgcBAQEBATicTicQAAAABzicTiAAAAAHE4nE4gAAAABxOJxOIAAAAAcTicTiAAAAAHE4nE4gAAAABxOJxOIAAAAA//sQxJYAC9RjL7mXgCGAjGb3MvAEcTicTiAAAAAHE4nE4gAAAABxOJxOIAAAAAcTicTiAAAAAHE4nE4gAAAABxOJxOIAAAAAcTicTiAAAAAHE4nE4gAAAABxOJxOIAAAAAcTicTiAAAAAHE4nE4gAAAABxOJxOIAAAAAcTicTiAAAAA=');
    audio.volume = 0.2;
    audio.play().catch(e => console.error("Erro ao reproduzir som:", e));
  };

  // Efeito sonoro para digitação
  const playTypeSound = useCallback(() => {
    if (codeTypingEffect) {
      const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+f///////////////////////////////////////////8AAAAATGF2YzU4Ljk3AAAAAAAAAAAAAAAACQAAAAAAAAAAASDxwunTAAAAAAAAAAAAAAAAAAAAAAD/+xDEAAPwAAGkAAAAIAAANIAAAARMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+xDEMIPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
      audio.volume = 0.05;
      audio.play().catch(() => {});
    }
  }, [codeTypingEffect]);

  // Reproduzir som de digitação enquanto o efeito está ativo
  useEffect(() => {
    let typeSoundInterval: number | null = null;

    if (codeTypingEffect) {
      typeSoundInterval = setInterval(playTypeSound, 100);
    }

    return () => {
      if (typeSoundInterval) clearInterval(typeSoundInterval);
    };
  }, [codeTypingEffect, playTypeSound]);

  // Efeito para mover o gráfico durante a geração do código
  useEffect(() => {
    let animationInterval: number | null = null;

    if (isGenerating || codeTypingEffect || codeShufflingEffect) {
      animationInterval = setInterval(() => {
        setChartPosition(prev => (prev + 1) % 100); // Move o gráfico 1 unidade para a esquerda
      }, 50); // Velocidade da animação
    }

    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isGenerating, codeTypingEffect, codeShufflingEffect]);

  // Efeito para evitar que a página role para o topo quando o iframe é exibido
  useEffect(() => {
    if (showIframe) {
      // Armazena a posição de rolagem atual
      let lastScrollPosition = window.scrollY;

      // Função para verificar e restaurar a posição de rolagem
      const checkScrollPosition = () => {
        // Se a página rolou para o topo e tínhamos uma posição anterior
        if (window.scrollY === 0 && lastScrollPosition > 10) {
          // Restaura a posição anterior
          window.scrollTo(0, lastScrollPosition);
        } else {
          // Atualiza a última posição conhecida
          lastScrollPosition = window.scrollY;
        }
      };

      // Configura um intervalo para verificar a posição de rolagem
      const scrollCheckInterval = setInterval(checkScrollPosition, 100);

      // Adiciona um evento específico para rolagem
      const handleScroll = () => {
        // Se a página rolou para o topo e tínhamos uma posição anterior
        if (window.scrollY === 0 && lastScrollPosition > 10) {
          // Restaura a posição anterior
          setTimeout(() => {
            window.scrollTo(0, lastScrollPosition);
          }, 10);
        } else {
          // Atualiza a última posição conhecida
          lastScrollPosition = window.scrollY;
        }
      };

      // Adiciona o evento de rolagem
      window.addEventListener('scroll', handleScroll, true);

      // Ajusta o iframe para mostrar o conteúdo completo
      const adjustIframe = () => {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.style.transform = 'none';
          iframe.style.width = '100%';
          iframe.style.marginLeft = '0';
          iframe.style.height = '650px';
        }
      };

      // Ajusta o iframe inicialmente
      adjustIframe();

      // Ajusta o iframe quando a tela for redimensionada
      window.addEventListener('resize', adjustIframe);

      // Adiciona um script global para prevenir rolagem para o topo
      const script = document.createElement('script');
      script.textContent = `
        // Sobrescreve a função scrollTo para evitar rolagem para o topo
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(x, y) {
          if (y === 0 && window.scrollY > 10) {
            // Ignora tentativas de rolar para o topo
            return;
          }
          originalScrollTo.apply(this, arguments);
        };
      `;
      document.head.appendChild(script);

      return () => {
        // Remove os eventos quando o iframe é fechado
        clearInterval(scrollCheckInterval);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', adjustIframe);
        document.head.removeChild(script);
      };
    }
  }, [showIframe]);

  // Função para gerar uma notificação aleatória
  const generateRandomNotification = useCallback(() => {
    // Escolher um nome aleatório
    const randomName = brazilianNames[Math.floor(Math.random() * brazilianNames.length)];

    // Escolher um valor aleatório (R$1029 ou R$1031)
    const amount = Math.random() < 0.5 ? "R$1029" : "R$1031";

    // Criar a notificação
    const newNotification: WithdrawalNotification = {
      id: Date.now(),
      name: randomName,
      amount,
      visible: true
    };

    // Adicionar a notificação à lista
    setNotifications(prev => {
      // Manter apenas as últimas 3 notificações
      const updatedNotifications = [newNotification, ...prev].slice(0, 3);
      return updatedNotifications;
    });

    // Remover a notificação após 5 segundos
    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== newNotification.id)
      );
    }, 5000);
  }, []);

  // Efeito para gerar notificações aleatórias periodicamente
  useEffect(() => {
    // Gerar a primeira notificação após 3 segundos
    const initialTimeout = setTimeout(() => {
      generateRandomNotification();
    }, 3000);

    // Gerar notificações a cada 8-15 segundos
    const interval = setInterval(() => {
      generateRandomNotification();
    }, Math.random() * 7000 + 8000); // Entre 8 e 15 segundos

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [generateRandomNotification]);

  // Verificar se há um código salvo no localStorage ao carregar a página
  useEffect(() => {
    const savedData = localStorage.getItem('cyberCodeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const currentTime = new Date().getTime();

      // Verificar se o código ainda é válido (menos de 1 hora)
      if (parsedData.expiryTime > currentTime) {
        setDisplayedCode(parsedData.code);
        setCodeGenerated(true);
        setCodeGeneratedTime(parsedData.generatedTime);
        setCanGenerateNewCode(false);
        updateTimeRemaining(parsedData.expiryTime);
      } else {
        // Se o código expirou, remover do localStorage
        localStorage.removeItem('cyberCodeData');
        setCanGenerateNewCode(true);
      }
    }
  }, []);

  // Atualizar o tempo restante a cada segundo
  useEffect(() => {
    if (!canGenerateNewCode && codeGeneratedTime) {
      const interval = setInterval(() => {
        const expiryTime = codeGeneratedTime + 3600000; // 1 hora em milissegundos
        const currentTime = new Date().getTime();

        if (currentTime >= expiryTime) {
          setCanGenerateNewCode(true);
          setTimeRemaining("");
          clearInterval(interval);
          localStorage.removeItem('cyberCodeData');
        } else {
          updateTimeRemaining(expiryTime);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [canGenerateNewCode, codeGeneratedTime]);

  // Função para atualizar o tempo restante
  const updateTimeRemaining = (expiryTime: number) => {
    const currentTime = new Date().getTime();
    const remainingMs = expiryTime - currentTime;

    if (remainingMs <= 0) {
      setTimeRemaining("");
      setCanGenerateNewCode(true);
      return;
    }

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  };

  return (
    <div className="min-h-screen w-screen bg-[#080619] text-gray-100 font-mono flex flex-col items-center justify-center relative overflow-hidden pt-safe pb-safe pl-safe pr-safe">
      <MatrixBackground />



      {/* Removido o gráfico decorativo que ficava atrás do título */}

      {/* Container de notificações */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 max-w-[250px]">
        {notifications.map(notification => (
          <WithdrawalNotificationItem
            key={notification.id}
            name={notification.name}
            amount={notification.amount}
          />
        ))}
      </div>

      <div className="w-full px-4 py-8 relative z-10 max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto">
        <header className="text-center mb-12">
          <div className="relative inline-block">
            {/* Efeito de brilho ao redor do título - mais sutil */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5010FF]/20 via-[#5010FF]/30 to-[#5010FF]/20 rounded-lg blur opacity-20"></div>

            {/* Efeito de binários ao redor do título - reduzido e mais sutil */}
            <div className="absolute -inset-8 flex items-center justify-center">
              <div className="text-[#5010FF]/30 text-xs absolute animate-pulse" style={{ top: '0%', left: '0%', animationDelay: '0.5s' }}>1</div>
              <div className="text-[#5010FF]/40 text-xs absolute animate-pulse" style={{ top: '20%', right: '10%', animationDelay: '1.2s' }}>0</div>
              <div className="text-[#5010FF]/30 text-xs absolute animate-pulse" style={{ bottom: '30%', left: '5%', animationDelay: '0.7s' }}>1</div>
              <div className="text-[#5010FF]/40 text-xs absolute animate-pulse" style={{ bottom: '10%', right: '0%', animationDelay: '1.5s' }}>0</div>
            </div>

            <h1 className="relative text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#5010FF] via-[#7030FF] to-[#5010FF] tracking-tight">
  CYBERCODE
</h1>

          </div>

          <p className="text-[#5010FF] text-[10px] md:text-xs font-light tracking-wider">
            [ Gerador de Código Seguro ]
          </p>

          {/* Separador com efeito de gradiente - mais sutil */}
          <div className="relative w-40 h-0.5 bg-gradient-to-r from-[#5010FF]/30 via-[#5010FF]/50 to-[#5010FF]/30 mx-auto mt-6 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>

          {/* Removido o indicador de opções binárias */}
        </header>

        {/* Layout com elementos um abaixo do outro */}
        <div className="flex flex-col items-center w-full mx-auto">
          {/* Gerador de código */}
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              {showButton && (
                <div className="relative mx-auto w-64">


                  <button
                    onClick={() => {
                      handleGenerateClick();
                      playClickSound();
                    }}
                    disabled={isGenerating || codeTypingEffect || codeShufflingEffect}
                    className={`relative w-full overflow-hidden px-8 ${!canGenerateNewCode && timeRemaining ? 'py-3' : 'py-4'} rounded-lg font-bold ${!canGenerateNewCode && timeRemaining ? 'text-lg' : 'text-xl'} uppercase tracking-wider text-center transition-all duration-300 border border-[#5010FF]/30 bg-gradient-to-b from-[#080619]/90 to-[#000000]/90 hover:from-[#000000]/90 hover:to-[#080619]/90 hover:border-[#5010FF]/50 focus:outline-none focus:ring-2 focus:ring-[#5010FF] focus:ring-opacity-50 disabled:opacity-70 group mx-auto block backdrop-blur-sm shadow-lg shadow-[#5010FF]/10`}
                  >
                    {/* Efeito de brilho nos cantos do botão */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#5010FF]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#5010FF]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#5010FF]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#5010FF]"></div>

                    {/* Indicadores binários nos cantos */}
                    <div className="absolute top-1 left-2 text-[#5010FF]/20 text-xs">1</div>
                    <div className="absolute bottom-1 right-2 text-[#5010FF]/20 text-xs">0</div>
                    <span className="relative z-10">
                      {isGenerating ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          <span>PROCESSANDO</span>
                        </div>
                      ) : canGenerateNewCode ? (
                        "GERAR CÓDIGO"
                      ) : (
                        <div className="flex flex-col items-center text-xs">
                          <span>GERE NOVAMENTE EM</span>
                          <span className="font-bold">{timeRemaining}</span>
                        </div>
                      )}
                    </span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#5010FF]/10 to-[#5010FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#5010FF] to-[#7030FF]"></div>
                  </button>
                </div>
              )}
            </div>

            {displayedCode && (
              <div className="backdrop-blur-sm bg-[#000000]/90 border border-[#5010FF]/20 rounded-lg overflow-hidden transition-all duration-500 animate-fadeIn shadow-xl shadow-[#5010FF]/10 relative">
                {/* Efeito de brilho nos cantos */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#5010FF] rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#5010FF] rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#5010FF] rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#5010FF] rounded-br-lg"></div>

                {/* Efeito de binários no fundo */}
                <div className="absolute top-1/4 left-1/4 text-[#5010FF]/10 text-4xl font-bold">1</div>
                <div className="absolute bottom-1/4 right-1/4 text-[#5010FF]/10 text-4xl font-bold">0</div>
                {/* Efeito de brilho no topo */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5010FF] to-transparent"></div>

                <div className="p-3 bg-[#080619]/90 border-b border-[#5010FF]/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#e63946]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#f1c453]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#5010FF] animate-pulse"></div>
                  </div>
                  <span className="text-xs text-[#5010FF] font-semibold tracking-wider">GERADOR</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5010FF]">ATIVO</span>
                    <div className="w-2 h-2 rounded-full bg-[#5010FF] animate-pulse"></div>
                  </div>
                </div>

                <div className="p-6 flex flex-col items-center">
                  {/* Gráfico de opções binárias com animação */}
                  <div className="w-full h-20 mb-6 opacity-90 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080619]/50"></div>
                    <div className="absolute inset-0" style={{ transform: `translateX(-${chartPosition}%)` }}>
                      <svg viewBox="0 0 200 20" className="w-[200%] h-full">
                        {/* Fundo do gráfico */}
                        <rect x="0" y="0" width="200" height="20" fill="#080619" opacity="0.5" />

                        {/* Linhas de grade */}
                        <path d="M0,5 L200,5" stroke="#00ff4c" strokeWidth="0.2" strokeDasharray="1,1" />
                        <path d="M0,10 L200,10" stroke="#00ff4c" strokeWidth="0.2" strokeDasharray="1,1" />
                        <path d="M0,15 L200,15" stroke="#00ff4c" strokeWidth="0.2" strokeDasharray="1,1" />

                        {/* Linhas de grade verticais */}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <path key={i} d={`M${i * 10},0 L${i * 10},20`} stroke="#00ff4c" strokeWidth="0.2" strokeDasharray="1,1" />
                        ))}

                        {/* Velas de opções binárias - Primeira metade */}
                        <rect x="10" y="6" width="3" height="6" fill="#00ff4c" />
                        <line x1="11.5" y1="4" x2="11.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="20" y="8" width="3" height="6" fill="#ff3c3c" />
                        <line x1="21.5" y1="6" x2="21.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="30" y="5" width="3" height="7" fill="#00ff4c" />
                        <line x1="31.5" y1="3" x2="31.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="40" y="9" width="3" height="5" fill="#ff3c3c" />
                        <line x1="41.5" y1="7" x2="41.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="50" y="4" width="3" height="8" fill="#00ff4c" />
                        <line x1="51.5" y1="2" x2="51.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="60" y="10" width="3" height="4" fill="#ff3c3c" />
                        <line x1="61.5" y1="8" x2="61.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="70" y="6" width="3" height="6" fill="#00ff4c" />
                        <line x1="71.5" y1="4" x2="71.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="80" y="9" width="3" height="5" fill="#ff3c3c" />
                        <line x1="81.5" y1="7" x2="81.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="90" y="5" width="3" height="7" fill="#00ff4c" />
                        <line x1="91.5" y1="3" x2="91.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        {/* Velas de opções binárias - Segunda metade (espelhada para continuar o padrão) */}
                        <rect x="110" y="6" width="3" height="6" fill="#00ff4c" />
                        <line x1="111.5" y1="4" x2="111.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="120" y="8" width="3" height="6" fill="#ff3c3c" />
                        <line x1="121.5" y1="6" x2="121.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="130" y="5" width="3" height="7" fill="#00ff4c" />
                        <line x1="131.5" y1="3" x2="131.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="140" y="9" width="3" height="5" fill="#ff3c3c" />
                        <line x1="141.5" y1="7" x2="141.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="150" y="4" width="3" height="8" fill="#00ff4c" />
                        <line x1="151.5" y1="2" x2="151.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="160" y="10" width="3" height="4" fill="#ff3c3c" />
                        <line x1="161.5" y1="8" x2="161.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="170" y="6" width="3" height="6" fill="#00ff4c" />
                        <line x1="171.5" y1="4" x2="171.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        <rect x="180" y="9" width="3" height="5" fill="#ff3c3c" />
                        <line x1="181.5" y1="7" x2="181.5" y2="16" stroke="#ff3c3c" strokeWidth="0.5" />

                        <rect x="190" y="5" width="3" height="7" fill="#00ff4c" />
                        <line x1="191.5" y1="3" x2="191.5" y2="14" stroke="#00ff4c" strokeWidth="0.5" />

                        {/* Linha de tendência */}
                        <path d="M0,10 L10,9 L20,11 L30,8 L40,12 L50,7 L60,13 L70,9 L80,12 L90,8 L100,10 L110,9 L120,11 L130,8 L140,12 L150,7 L160,13 L170,9 L180,12 L190,8 L200,10" stroke="#5010FF" strokeWidth="0.5" fill="none" strokeDasharray="2,1" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative bg-[#080619]/90 px-6 py-5 rounded-lg border border-[#5010FF]/20 mb-6 w-full backdrop-blur-sm">
                    {/* Efeito de brilho no topo */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5010FF]/30 to-transparent"></div>

                    {/* Indicadores binários nos cantos removidos */}

                    <div className={`text-2xl font-bold tracking-widest text-center ${codeShufflingEffect ? shuffleColor : codeGenerated ? 'text-[#5010FF]' : 'text-[#5010FF]'} ${codeTypingEffect ? 'border-r-2 border-[#5010FF] animate-pulse' : ''}`}>
                      {displayedCode}
                    </div>

                    {codeGenerated && (
                      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-[#5010FF] animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7 7-7" />
                        </svg>
                      </div>
                    )}


                  </div>

                  {/* Botões só aparecem quando o código estiver completamente gerado */}
                  {codeGenerated && !codeTypingEffect && !codeShufflingEffect && (
                    <div className="w-full space-y-3 animate-fadeIn">
                      {/* Mensagem de confirmação de cópia - posicionada acima do botão */}
                      {codeCopied && (
                        <div className="bg-[#5010FF]/90 text-white text-sm md:text-base py-2 px-4 rounded-md shadow-md mb-2 border border-[#5010FF]/30 animate-fadeIn">
                          <div className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Código copiado com sucesso!</span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          handleCopyClick();
                          playClickSound();
                        }}
                        className="px-4 py-3 rounded-md bg-gradient-to-r from-[#5010FF]/80 to-[#5010FF]/80 hover:from-[#5010FF] hover:to-[#5010FF] transition-all flex items-center gap-2 w-full justify-center shadow-md shadow-[#5010FF]/10 border border-[#5010FF]/20"
                        title="Copiar código"
                      >
                        <Copy size={20} className="text-white" />
                        <span className="text-white font-bold">Copiar código</span>
                      </button>

                      <button
                        onClick={handleBrokerClick}
                        className="px-4 py-3 rounded-md bg-gradient-to-r from-[#5010FF]/80 to-[#5010FF]/80 hover:from-[#5010FF] hover:to-[#5010FF] transition-all flex items-center gap-2 w-full justify-center shadow-md shadow-[#5010FF]/10 border border-[#5010FF]/20"
                      >
                        <ExternalLink size={20} className="text-white" />
                        <span className="text-white font-bold">Acessar corretora</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Iframe da corretora (abaixo do gerador de código) */}
          {showIframe && (
            <div className="mt-12 w-[calc(100vw-10px)] sm:w-full md:h-auto lg:h-auto xl:h-auto border border-[#5010FF]/20 rounded-lg relative backdrop-blur-sm bg-[#080619]/90 shadow-xl shadow-[#5010FF]/10 md:w-[98%] lg:w-[99%] xl:w-[100%] mx-auto" style={{ overflowX: 'hidden', overflowY: 'hidden', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
              {/* Efeito de brilho nos cantos */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#5010FF] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#5010FF] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#5010FF] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#5010FF] rounded-br-lg"></div>

              {/* Efeito de brilho no topo */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5010FF] to-transparent"></div>

              {/* Indicadores binários nos cantos */}
              <div className="absolute top-10 left-6 text-[#5010FF]/10 text-4xl font-bold">1</div>
              <div className="absolute bottom-10 right-6 text-[#5010FF]/10 text-4xl font-bold">0</div>

              <div className="absolute top-0 left-0 w-full bg-[#000000]/90 p-3 flex justify-between items-center z-10 border-b border-[#5010FF]/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#e63946]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#f1c453]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#5010FF]"></div>
                </div>
                <span className="text-xs text-[#5010FF] font-semibold tracking-wider">CORRETORA</span>
                <button
                  onClick={handleRefreshIframe}
                  className="text-[#5010FF] hover:text-[#5010FF]/80 text-xs px-3 py-1 rounded-md hover:bg-[#080619]/90 border border-[#5010FF]/20 transition-colors"
                >
                  ATUALIZAR
                </button>
              </div>

              <div className="pt-12 w-full overflow-hidden iframe-container" style={{ position: 'relative', height: 'auto', minHeight: '500px' }}>
                <iframe
                  src="https://versobinary.com/pt/signUp"
                  className="w-full h-full"
                  title="Corretora"
                  allow="cookies"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-storage-access-by-user-activation allow-modals allow-downloads allow-popups-to-escape-sandbox"
                  style={{
                    overflow: 'auto',
                    border: 'none',
                    width: '100%',
                    height: '650px',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center">


          <p className="text-gray-400 text-xs font-light tracking-wider">
            <span className="">&lt;</span>
            <span className="text-[#5010FF]">/</span>
            <span className="">&gt;</span>
            <span className="mx-2">com tecnologia criptografada</span>
            <span className="text-gray-500">|</span>
            <span className="ml-2">{new Date().getFullYear()}</span>
          </p>

        </footer>
      </div>
    </div>
  );
}

export default App;
