/**
 * Splits text into optimal blocks for progressive rendering
 * Respects markdown structure and readability
 */
export function splitIntoBlocks(text: string): string[] {
  if (!text.trim()) return [];

  const blocks: string[] = [];

  // First, split by double newlines (paragraph breaks)
  const paragraphs = text.split(/\n\n+/);

  paragraphs.forEach((para) => {
    if (!para.trim()) return;

    const trimmed = para.trim();

    // Check if it's a markdown title
    if (trimmed.match(/^#+\s+/)) {
      blocks.push(trimmed);
      return;
    }

    // Check if it's a code block
    if (trimmed.startsWith("```")) {
      blocks.push(trimmed);
      return;
    }

    // Check if it's a list
    if (trimmed.match(/^[\*\-\+]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      blocks.push(trimmed);
      return;
    }

    // Check if it's a blockquote
    if (trimmed.startsWith(">")) {
      blocks.push(trimmed);
      return;
    }

    // For regular paragraphs, split if too long (> 300 chars)
    if (trimmed.length > 300) {
      const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [trimmed];

      let currentBlock = "";
      sentences.forEach((sentence) => {
        const sentenceTrimmed = sentence.trim();
        if ((currentBlock + sentenceTrimmed).length > 300) {
          if (currentBlock) blocks.push(currentBlock.trim());
          currentBlock = sentenceTrimmed;
        } else {
          currentBlock += (currentBlock ? " " : "") + sentenceTrimmed;
        }
      });

      if (currentBlock) {
        blocks.push(currentBlock.trim());
      }
    } else {
      blocks.push(trimmed);
    }
  });

  return blocks.filter((block) => block.trim().length > 0);
}

/**
 * Calculates pause duration based on block length
 * Longer blocks get longer pauses for natural reading
 */
export function getBlockPauseDuration(blockText: string): number {
  const length = blockText.length;

  if (length < 50) return 200;
  if (length < 150) return 350;
  if (length < 300) return 450;
  return 600;
}

/**
 * Gets the animation delay for a block index
 * Creates a staggered effect
 */
export function getBlockAnimationDelay(index: number): number {
  return index * 50; // 50ms stagger per block
}
