import { EPSILON, InitialParams } from '../const';
import { AnomalyDetectorParams, AnomalyParamsMap, AnomalySesonalityMap } from '../types';

/**
 * Service class for managing parameters.
 *
 * @class
 */
export class ParameterService {
  private parameters: AnomalyParamsMap;
  private seasonality: AnomalySesonalityMap;

  private seasonLength: number;
  private learningRate: number;

  /**
   * Constructs a new instance of ParameterService
   * @param {number} seasonLength - the length of season
   * @param {number} learningRate - the learning rate
   */
  constructor(seasonLength: number, learningRate: number) {
    this.parameters = new Map();
    this.seasonality = new Map();

    this.seasonLength = seasonLength;
    this.learningRate = learningRate;
  }

  /**
   * Initializes the instance params for a given key.
   * @public
   * @param {string} key - the key to initialize
   */
  public initializeParamtersIfNeeded(key: string) {
    if (!this.parameters.has(key)) {
      this.parameters.set(key, {
        alpha: InitialParams.ALPHA,
        beta: InitialParams.BETA,
        gamma: InitialParams.GAMMA,
      });
      this.seasonality.set(key, new Array(this.seasonLength).fill(1));
    }
  }

  /**
   * Retrieves the anomaly detection parameters for a given key.
   * @public
   * @param {string} key - the key to retrieve parameters for
   * @returns {AnomalyDetectorParams | undefined} - the parameters associated with the key, or undefined if no such key exists
   */
  public getParameters(key: string): AnomalyDetectorParams | undefined {
    return this.parameters.get(key);
  }

  /**
   * Retrieves the seasonality array for a given key.
   * @public
   * @param {string} key - the key to retrieve seasonality for
   * @returns {number[] | undefined} - the seasonality associated with the key, or undefined if no such key exists
   */
  public getSeasonality(key: string): number[] | undefined {
    return this.seasonality.get(key);
  }

  /**
   * Adjust the parameters alpha, beta and gamma based on the calculated error.
   * @public
   * @param {string} key - the key for which the parameters are adjusted
   * @param {number} error - the calculated error
   * @param {number} forecast - the predicted value
   * @param {number} value - the current value
   */
  public adjustParameters(key: string, error: number, forecast: number, value: number) {
    const params = this.parameters.get(key)!;

    const gradientAlpha = (error * value) / (params.alpha + EPSILON);
    const gradientBeta = (error * (forecast - value)) / (params.beta + EPSILON);
    const gradientGamma = (error * (value - forecast)) / (params.gamma + EPSILON);

    params.alpha = this.adjustParameter(params.alpha, gradientAlpha, this.learningRate);
    params.beta = this.adjustParameter(params.beta, gradientBeta, this.learningRate);
    params.gamma = this.adjustParameter(params.gamma, gradientGamma, this.learningRate);

    this.parameters.set(key, params);
  }

  /**
   * Adjust a parameter based on the gradient value.
   * @private
   * @param {number} param - the current parameter value
   * @param {number} gradientVal - the gradient value
   * @returns {number} - the adjusted parameter value
   */
  private adjustParameter(param: number, gradientVal: number, learningRate: number): number {
    return Math.max(0, Math.min(param - learningRate * gradientVal, 1));
  }
}
