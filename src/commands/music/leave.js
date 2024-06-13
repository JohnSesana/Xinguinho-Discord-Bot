import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "leave",
  description: "Remove o bot de um canal de voz",
  category: "music",
  validateVC: true,
};
export function execute(interaction, queue) {
  if (!queue) {
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Eu não estou tocando nada agora!")],
    });
  }

  if (!queue.deleted) queue.delete();

  return interaction.reply({
    embeds: [SuccessEmbed("Saiu do canal de voz.")],
  });
}
