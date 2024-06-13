import { QueueRepeatMode } from "discord-player";
import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "skip",
  description: "Pular para a próxima música",
  category: "music",
  queueOnly: true,
  validateVC: true,
};
export function execute(interaction, queue) {
  if (queue.isEmpty() && queue.repeatMode !== QueueRepeatMode.AUTOPLAY)
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Nenhuma música a seguir.")],
    });

  queue.node.skip();

  return interaction.reply({
    embeds: [SuccessEmbed("Pulou para a próxima música.")],
  });
}
