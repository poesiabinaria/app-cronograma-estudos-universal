$(document).ready(function(){

	// INÍCIO DAS FUNÇÕES

	function formatarNumero(valor){ return valor.replace(",", ".") }
	function ehNumero(valor){ return isNaN(Number(formatarNumero(valor))) ? false : true; }

	function validarInputESelect(str_nomeClasse){
		var valido;

		$(str_nomeClasse).each(function(index, value){
			var inputs = $(this).find(':input').val();
			var selects = $(this).find('select').val();

			if(!inputs.length || (selects == null)){ 
				valido = false;
				return false;
			
			} else{ valido = true; }
		}) 

		return valido;
	}

	function validarInputNumerico(str_nomeClasse){
		var valido;
		
		$(str_nomeClasse).each(function(index, value){
			var inputs = $(this).val();

			if (!ehNumero(inputs) || !inputs.length){
				valido = false;
				return false;
				
			} else{ valido = true; }
		})	

		return valido;
	}

	function validarEtapa1(){

		var inputESelectValidos = validarInputESelect(".individual-input_sel-discipl");

		return inputESelectValidos;
	}
	

	function validarEtapa3(){

		var inputsNumericosValidos = 
		validarInputNumerico(".box-coletar-numeros-tempo .input-numerico");

		return inputsNumericosValidos ? true : false;
	}

	// FIM DAS FUNÇÕES
	



	var i = 3;

	$("#btn-add-disciplina").click(function(){

		var selecaoTipo = "<select class='tag-selecao-importancia' required>" +
							  "<option value='' disabled selected>Importância</option>" +
							  "<option value='1'>1 - Baixa</option>" +
							  "<option value='2'>2 - Média</option>" +
							  "<option value='3'>3 - Alta</option>" +
							"</select>"

		var div_InputSelectIndividual =  $(document.createElement("div"));
		div_InputSelectIndividual.attr("class", "individual-input_sel-discipl");
		
		var input_Discipl =  $(document.createElement("input"));
		div_InputSelectIndividual.attr("id", "input-select-" + i);
		input_Discipl.attr("class", "input-disciplina");

		$(input_Discipl).appendTo(div_InputSelectIndividual);
		$(selecaoTipo).appendTo(div_InputSelectIndividual);
		
		$(".todos-inputs-disciplinas").append(div_InputSelectIndividual);

		i++;

	});

	$("#btn-remover").click(function(){

		if(i == 3){
			alert("Desculpe, não é mais possível apagar.")
			return false;
		}
		
		i--;

		$("#input-select-" + i).remove()

	});




	var listaDisciplinas = [];
	var somaTotalPesoFinal = 0;

	
	// INÍCIO - ETAPA 1
	
	$("#btn-concl-etapa1").click(function(){ // Executa 

		prosseguir = validarEtapa1();

		if (prosseguir){

			$(".individual-input_sel-discipl").each(function(){ 
				var disciplinas = {};
				var nomeDisciplina = $(this).find(':input').val();
				var pesoImportancia = $(this).find('select').val();

				disciplinas.nomeDisciplina = nomeDisciplina;
				disciplinas.pesoImportancia = pesoImportancia;

				listaDisciplinas.push(disciplinas);
			});

			console.log(listaDisciplinas);

			
			var selecaoDificuldade = "<select class='tag-selecao'>" +
				  "<option value='1'>1 - Muito fácil</option>" +
				  "<option value='1.5'>1,5 - Fácil</option>" +
				  "<option value='2'>2 - Meio termo</option>" +
				  "<option value='2.5'>2,5 - Difícil</option>" +
				  "<option value='3'>3 - Muito difícil</option>" +
				"</select>";
			
			$.each(listaDisciplinas, function(index, valor){
				$(".questionamento-dificuldade").append("<p>" + this.nomeDisciplina + ": " + 
					selecaoDificuldade + "</p>");	
			}); 

			$("#conteudo-secundario-etapa1").hide();
			$("#conteudo-secundario-etapa2").fadeIn();

			$("#indicacao-etp1").attr("src", "img/v-check.png")
			$("#reticencias-etp-2").hide();
			$("#href-etp1").attr("href", "#etapa2")
		
		}else { alert("Parece que há algo errado e/ou incompleto. Por gentileza, revise essa primeira etapa.") }
	
	}); // FIM - ETAPA 1

	
		

	// INÍCIO - ETAPA 2

	$("#btn-concl-etapa2").click(function(){

		$.each($(".tag-selecao"), function(index, valor){

			listaDisciplinas[index].
			pesoAfinidade = parseFloat($(valor).val());
		});

		console.log(listaDisciplinas);

		// CALCULO E INSERÇÃO DO PESO FINAL E SUA SOMA
		
		$.each(listaDisciplinas, function(index, valor){
			
			var pesoFinal = 0;

			pesoFinal = (this.pesoImportancia * this.pesoAfinidade);

			this.pesoFinal = (pesoFinal).toFixed(1);

			somaTotalPesoFinal += pesoFinal;
		}); 

		console.log(listaDisciplinas);

		$("#conteudo-secundario-etapa2").hide();
		$("#conteudo-secundario-etapa3").fadeIn();

		$("#indicacao-etp2").attr("src", "img/v-check.png")
		$("#reticencias-etp-3").hide();
		$("#href-etp2").attr("href", "#etapa3")
		
	}); // FIM - ETAPA 2

	

	// INÍCIO - ETAPA 3 

	$("#btn-mostrar-resultado").click(function(){

		var prosseguir = validarEtapa3();

		if (prosseguir){
			var qtdHorasSemanais = parseFloat(Math.abs($("#qtd-horas-semanais").val()));
			var qtdMinutosSecao = parseFloat(Math.abs($("#qtd-minutos-secao").val()));
			var qtdMinutosIntervalo = parseFloat(Math.abs($("#qtd-minutos-intervalo").val()));
			
			var qtdCompartimento = Math.round((60/(qtdMinutosSecao + qtdMinutosIntervalo))*qtdHorasSemanais);
			
			var equivPesoeCompart = parseFloat((qtdCompartimento/(somaTotalPesoFinal * 100)) * 100);

			$.each(listaDisciplinas, function(index, valor){
				var numCompartFinal = 0;

				numCompartFinal = this.pesoFinal * equivPesoeCompart;

				this.numCompartSemanal = numCompartFinal;
			})
			

			
			// INÍCIO DO RESULTADO FINAL

			var tabelaPrincipal = $("#tabela-principal");

			$(listaDisciplinas).each(function(index, valor){
				
				var tr = $("<tr></tr>").appendTo(tabelaPrincipal);

				$("<td></td>").text(this.nomeDisciplina).appendTo(tr);
				$("<td></td>").text(this.pesoImportancia).appendTo(tr);
				$("<td></td>").text(this.pesoAfinidade).appendTo(tr);
				$("<td></td>").text(this.pesoFinal).appendTo(tr);
				$("<td></td>").text(Math.round(this.numCompartSemanal)).appendTo(tr);
			})

			$("#conteudo-secundario-etapa3").hide();
			$("#conteudo-secundario-resultado").fadeIn();

			$("#indicacao-etp3").attr("src", "img/v-check.png");
			$("#indicacao-resultado").attr("src", "img/flag-check.png");
			$("#reticencias-etp-resultado").hide();
			$("#href-etp3").attr("href", "#etapa-resultado");

			var disciplinaNomeEx = listaDisciplinas[0].nomeDisciplina;
			var disciplinaSessoesEx = Math.round(listaDisciplinas[0].numCompartSemanal);

			$("#dscpl-nome-ex").append(disciplinaNomeEx);
			$("#dscpl-sessoes-ex").append(disciplinaSessoesEx + " sessões");
			$("#duracao-sessao-ex").append(qtdMinutosSecao + " minutos");
			$("#intervalo-descanso-ex").append(qtdMinutosIntervalo + " minutos");
			$("#horas-semanais-ex").append(qtdHorasSemanais + " horas");

			$("#btn-ver-detalhes").click(function(){
				
				$("#td-horas-semanais").append(qtdHorasSemanais);
				$("#td-duracao-secao").append(qtdMinutosSecao);
				$("#td-duracao-intervalo").append(qtdMinutosIntervalo);
				$("#td-total-compart").append(qtdCompartimento);
				$("#td-soma-peso-final").append(somaTotalPesoFinal.toFixed(1));
				$("#td-relacao-peso-compart").append(equivPesoeCompart.toFixed(1));

				$(".detalhes-calculo-conteudo").fadeIn();
				$("#btn-ver-detalhes").hide();
			})

		} else{
			alert("Parece que há algo errado e/ou incompleto. Por gentileza, revise essa terceira etapa.")
		}

	}) // FIM - ETAPA 3
});

