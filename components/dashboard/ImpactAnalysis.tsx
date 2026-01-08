import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnaliseImpacto, ImpactoItem } from '@/lib/impactAnalysis';
import { TrendingUp, TrendingDown, ChevronRight, X, AlertCircle, Lightbulb } from 'lucide-react';

interface ImpactAnalysisProps {
  analise: AnaliseImpacto;
  onClose: () => void;
}

export function ImpactAnalysis({ analise, onClose }: ImpactAnalysisProps) {
  const [nivelDetalhe, setNivelDetalhe] = useState<'canal' | 'dia' | 'horario'>('canal');
  const isPositivo = analise.variacao > 0;
  const Icon = isPositivo ? TrendingUp : TrendingDown;
  const corVariacao = isPositivo ? 'text-green-600' : 'text-red-600';
  const bgVariacao = isPositivo ? 'bg-green-500/10' : 'bg-red-500/10';

  const dados = {
    canal: analise.porCanal,
    dia: analise.porDiaSemana,
    horario: analise.porHorario
  };

  const titulos = {
    canal: 'Por Canal',
    dia: 'Por Dia da Semana',
    horario: 'Por Horário'
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon className={`w-6 h-6 ${corVariacao}`} />
                Análise de Impacto: {analise.metrica.toUpperCase()}
              </CardTitle>
              <CardDescription className="mt-2">
                Identificando causas da variação de{' '}
                <span className={`font-bold ${corVariacao}`}>
                  {analise.variacaoPercentual > 0 ? '+' : ''}
                  {analise.variacaoPercentual.toFixed(1)}%
                </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Resumo Executivo */}
          <div className={`p-4 rounded-lg border ${bgVariacao}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Mês Anterior</p>
                <p className="text-2xl font-bold">{analise.valorAnterior.toFixed(1)}</p>
              </div>
              <div className="flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mês Atual</p>
                <p className={`text-2xl font-bold ${corVariacao}`}>{analise.valorAtual.toFixed(1)}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {analise.causaPrincipal}
              </p>
            </div>
          </div>

          {/* Tabs de Detalhamento */}
          <div>
            <div className="flex gap-2 mb-4">
              {(['canal', 'dia', 'horario'] as const).map((tipo) => (
                <Button
                  key={tipo}
                  variant={nivelDetalhe === tipo ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNivelDetalhe(tipo)}
                >
                  {titulos[tipo]}
                </Button>
              ))}
            </div>

            {/* Lista de Impactos */}
            <div className="space-y-3">
              {dados[nivelDetalhe].map((item, index) => (
                <ImpactoItemCard key={index} item={item} rank={index + 1} />
              ))}
            </div>
          </div>

          {/* Diagnóstico Automático */}
          {analise.diagnostico.length > 0 && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-600">
                <Lightbulb className="w-5 h-5" />
                Diagnóstico Automático
              </h4>
              <ul className="space-y-2">
                {analise.diagnostico.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={() => {
              const texto = gerarTextoRelatorio(analise);
              navigator.clipboard.writeText(texto);
              alert('Diagnóstico copiado para área de transferência!');
            }}>
              📋 Copiar Diagnóstico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ImpactoItemCard({ item, rank }: { item: ImpactoItem; rank: number }) {
  const isPositivo = item.variacao > 0;
  const porcentagemAbs = Math.abs(item.variacaoPercentual);
  const contribuicaoAbs = Math.abs(item.contribuicaoImpacto);
  
  // Cor baseada na magnitude do impacto
  const cor = contribuicaoAbs > 40 ? 'red' : contribuicaoAbs > 20 ? 'yellow' : 'gray';
  const bgColor = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-400'
  }[cor];

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${bgColor}/20 flex items-center justify-center font-bold text-sm`}>
            {rank}
          </div>
          <div>
            <p className="font-semibold">{item.nome}</p>
            <p className="text-xs text-muted-foreground">
              Contribuiu com {contribuicaoAbs.toFixed(0)}% do impacto
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isPositivo ? 'text-green-600' : 'text-red-600'}`}>
            {isPositivo ? '+' : ''}{item.variacao.toFixed(0)}
          </p>
          <p className={`text-xs ${isPositivo ? 'text-green-600' : 'text-red-600'}`}>
            {isPositivo ? '+' : ''}{porcentagemAbs.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} transition-all duration-500`}
          style={{ width: `${Math.min(contribuicaoAbs, 100)}%` }}
        />
      </div>
    </div>
  );
}

function gerarTextoRelatorio(analise: AnaliseImpacto): string {
  const tipo = analise.variacao > 0 ? 'aumento' : 'queda';
  let texto = `ANÁLISE DE IMPACTO: ${analise.metrica.toUpperCase()}\n\n`;
  
  texto += `📊 RESUMO\n`;
  texto += `Mês anterior: ${analise.valorAnterior.toFixed(1)}\n`;
  texto += `Mês atual: ${analise.valorAtual.toFixed(1)}\n`;
  texto += `Variação: ${analise.variacao > 0 ? '+' : ''}${analise.variacao.toFixed(1)} (${analise.variacaoPercentual.toFixed(1)}%)\n\n`;
  
  texto += `🎯 CAUSA PRINCIPAL\n${analise.causaPrincipal}\n\n`;
  
  texto += `📈 DETALHAMENTO POR CANAL\n`;
  analise.porCanal.forEach((item, i) => {
    texto += `${i + 1}. ${item.nome}: ${item.variacao > 0 ? '+' : ''}${item.variacao.toFixed(0)} (${item.variacaoPercentual.toFixed(1)}%)\n`;
  });
  
  texto += `\n💡 DIAGNÓSTICO\n`;
  analise.diagnostico.forEach((d, i) => {
    texto += `• ${d}\n`;
  });
  
  return texto;
}